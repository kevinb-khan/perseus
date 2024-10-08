/**
 * Render the Mafs graph with the specified background and graph elements.
 *
 * Render order (back to front):
 * - Grid
 * - Axis Ticks, Axis Arrows, and Axis Labels
 * - Locked Figures
 * - Locked Labels
 * - Protractor
 * - Interactive Graph Elements
 */
import Button from "@khanacademy/wonder-blocks-button";
import {View} from "@khanacademy/wonder-blocks-core";
import {UnreachableCaseError} from "@khanacademy/wonder-stuff-core";
import {Mafs} from "mafs";
import * as React from "react";

import AxisArrows from "./backgrounds/axis-arrows";
import AxisLabels from "./backgrounds/axis-labels";
import {AxisTicks} from "./backgrounds/axis-ticks";
import {Grid} from "./backgrounds/grid";
import {LegacyGrid} from "./backgrounds/legacy-grid";
import GraphLockedLabelsLayer from "./graph-locked-labels-layer";
import GraphLockedLayer from "./graph-locked-layer";
import {
    LinearGraph,
    LinearSystemGraph,
    PolygonGraph,
    RayGraph,
    SegmentGraph,
    CircleGraph,
    QuadraticGraph,
    SinusoidGraph,
    AngleGraph,
} from "./graphs";
import {SvgDefs} from "./graphs/components/text-label";
import {PointGraph} from "./graphs/point";
import {MIN, X, Y} from "./math";
import {Protractor} from "./protractor";
import {type InteractiveGraphAction} from "./reducer/interactive-graph-action";
import {actions} from "./reducer/interactive-graph-action";
import {GraphConfigContext} from "./reducer/use-graph-config";

import type {
    InteractiveGraphState,
    InteractiveGraphProps,
    PointGraphState,
} from "./types";
import type {APIOptions} from "../../types";
import type {vec} from "mafs";

import "mafs/core.css";
import "./mafs-styles.css";

export type MafsGraphProps = {
    flags?: APIOptions["flags"];
    box: [number, number];
    backgroundImage?: InteractiveGraphProps["backgroundImage"];
    lockedFigures?: InteractiveGraphProps["lockedFigures"];
    step: InteractiveGraphProps["step"];
    gridStep: InteractiveGraphProps["gridStep"];
    containerSizeClass: InteractiveGraphProps["containerSizeClass"];
    markings: InteractiveGraphProps["markings"];
    showTooltips: Required<InteractiveGraphProps["showTooltips"]>;
    showProtractor: boolean;
    labels: InteractiveGraphProps["labels"];
    fullGraphAriaLabel?: InteractiveGraphProps["fullGraphAriaLabel"];
    fullGraphAriaDescription?: InteractiveGraphProps["fullGraphAriaDescription"];
    state: InteractiveGraphState;
    dispatch: React.Dispatch<InteractiveGraphAction>;
    readOnly: boolean;
    static: boolean | null | undefined;
};

export const REMOVE_BUTTON_ID = "perseus_mafs_remove_button";

export const MafsGraph = (props: MafsGraphProps) => {
    const {
        state,
        dispatch,
        labels,
        readOnly,
        fullGraphAriaLabel,
        fullGraphAriaDescription,
    } = props;
    const [width, height] = props.box;
    const tickStep = props.step as vec.Vector2;

    const uniqueId = React.useId();
    const descriptionId = `interactive-graph-description-${uniqueId}`;
    const graphRef = React.useRef<HTMLElement>(null);

    // Set up the SVG attributes for the nested SVGs that help lock
    // the grid and graph elements to the bounds of the graph.
    const {viewboxX, viewboxY} = calculateNestedSVGCoords(
        state.range,
        width,
        height,
    );
    const viewBox = `${viewboxX} ${viewboxY} ${width} ${height}`;
    const nestedSVGAttributes: React.SVGAttributes<SVGSVGElement> = {
        width,
        height,
        viewBox,
        preserveAspectRatio: "xMidYMin",
        x: viewboxX,
        y: viewboxY,
    };

    return (
        <GraphConfigContext.Provider
            value={{
                range: state.range,
                snapStep: state.snapStep,
                markings: props.markings,
                tickStep: tickStep,
                gridStep: props.gridStep,
                showTooltips: !!props.showTooltips,
                graphDimensionsInPixels: props.box,
                width,
                height,
                labels,
                disableKeyboardInteraction: readOnly || !!props.static,
            }}
        >
            <View>
                <View
                    className="mafs-graph"
                    style={{
                        position: "relative",
                        padding: "25px 25px 0 0",
                        boxSizing: "content-box",
                        marginLeft: "20px",
                        marginBottom: "30px",
                        pointerEvents: props.static ? "none" : "auto",
                        userSelect: "none",
                        width,
                        height,
                    }}
                    onKeyUp={(event) => {
                        if (event.key === "Backspace") {
                            dispatch(actions.global.deleteIntent());
                            graphRef.current?.focus();
                        }
                    }}
                    aria-label={fullGraphAriaLabel}
                    aria-describedby={
                        fullGraphAriaDescription ? descriptionId : undefined
                    }
                    ref={graphRef}
                    tabIndex={0}
                >
                    {fullGraphAriaDescription && (
                        <View
                            id={descriptionId}
                            tabIndex={-1}
                            style={{
                                width: 0,
                                height: 0,
                                overflow: "hidden",
                            }}
                        >
                            {fullGraphAriaDescription}
                        </View>
                    )}
                    <LegacyGrid
                        box={props.box}
                        backgroundImage={props.backgroundImage}
                    />
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        {props.markings === "graph" && (
                            <>
                                <AxisLabels />
                            </>
                        )}
                        <Mafs
                            preserveAspectRatio={false}
                            viewBox={{
                                x: state.range[X],
                                y: state.range[Y],
                                padding: 0,
                            }}
                            pan={false}
                            zoom={false}
                            width={width}
                            height={height}
                        >
                            {/* Svg definitions to render only once */}
                            <SvgDefs />
                            {/* Cartesian grid nested in an SVG to lock to graph bounds */}
                            <svg {...nestedSVGAttributes}>
                                <Grid
                                    gridStep={props.gridStep}
                                    range={state.range}
                                    containerSizeClass={
                                        props.containerSizeClass
                                    }
                                    markings={props.markings}
                                    width={width}
                                    height={height}
                                />
                            </svg>
                            {/* Axis Ticks, Labels, and Arrows */}
                            {
                                // Only render the axis ticks and arrows if the markings are set to a full "graph"
                                props.markings === "graph" && (
                                    <>
                                        <AxisTicks />
                                        <AxisArrows />
                                    </>
                                )
                            }
                            {/* Locked & Interactive elements nested an SVG to lock to graph bounds*/}
                            <svg {...nestedSVGAttributes}>
                                {/* Locked figures layer */}
                                {props.lockedFigures && (
                                    <GraphLockedLayer
                                        lockedFigures={props.lockedFigures}
                                        range={state.range}
                                    />
                                )}
                            </svg>
                        </Mafs>
                        {props.flags?.["mafs"]?.[
                            "interactive-graph-locked-features-labels"
                        ] &&
                            props.lockedFigures && (
                                <GraphLockedLabelsLayer
                                    flags={props.flags}
                                    lockedFigures={props.lockedFigures}
                                />
                            )}
                        <View style={{position: "absolute"}}>
                            <Mafs
                                preserveAspectRatio={false}
                                viewBox={{
                                    x: state.range[X],
                                    y: state.range[Y],
                                    padding: 0,
                                }}
                                pan={false}
                                zoom={false}
                                width={width}
                                height={height}
                            >
                                {/* Intearctive Elements are nested in an SVG to lock them to graph bounds */}
                                <svg {...nestedSVGAttributes}>
                                    {/* Protractor */}
                                    {props.showProtractor && <Protractor />}
                                    {/* Interactive layer */}
                                    {renderGraph({
                                        state,
                                        dispatch,
                                    })}
                                </svg>
                            </Mafs>
                        </View>
                    </View>
                </View>
                {renderGraphControls({state, dispatch, width})}
            </View>
        </GraphConfigContext.Provider>
    );
};

const renderPointGraphControls = (props: {
    state: PointGraphState;
    dispatch: (action: InteractiveGraphAction) => unknown;
    width: number;
}) => (
    <View
        style={{
            flexDirection: "row",
            width: props.width,
        }}
    >
        {/* <Button
            kind="secondary"
            style={{
                width: "100%",
                marginLeft: "20px",
            }}
            tabIndex={0}
            onClick={() => {
                props.dispatch(actions.pointGraph.addPoint([0, 0]));
            }}
        >
            Add Point
        </Button> */}
        {props.state.showRemovePointButton &&
            props.state.focusedPointIndex !== null && (
                <Button
                    id={REMOVE_BUTTON_ID}
                    kind="secondary"
                    color="destructive"
                    tabIndex={-1}
                    style={{
                        width: "100%",
                        marginLeft: "20px",
                    }}
                    onClick={(event) => {
                        props.dispatch(
                            actions.pointGraph.removePoint(
                                props.state.focusedPointIndex!,
                            ),
                        );
                    }}
                >
                    Remove Point
                </Button>
            )}
    </View>
);

const renderGraphControls = (props: {
    state: InteractiveGraphState;
    dispatch: (action: InteractiveGraphAction) => unknown;
    width: number;
}) => {
    const {state, dispatch, width} = props;
    const {type} = state;
    switch (type) {
        case "point":
            if (state.numPoints === "unlimited") {
                return renderPointGraphControls({state, dispatch, width});
            }
            return null;
        default:
            return null;
    }
};

// Calculate the difference between the min and max values of a range
const getRangeDiff = (range: vec.Vector2) => {
    const [min, max] = range;
    return Math.abs(max - min);
};

// We need to adjust the nested SVG viewbox x and Y values based on the range of the graph in order
// to ensure that the graph is sized and positioned correctly within the Mafs SVG and the clipping mask.
// Exported for testing.
export const calculateNestedSVGCoords = (
    range: vec.Vector2[],
    width: number,
    height: number,
): {viewboxX: number; viewboxY: number} => {
    // X RANGE
    let viewboxX = 0; // When xMin is 0, we want to use 0 as the viewboxX value
    const totalXRange = getRangeDiff(range[X]);
    const gridCellWidth = width / totalXRange;
    const minX = range[X][MIN];

    // If xMin is entirely positive, we need to adjust the
    // viewboxX to be the grid cell width multiplied by xMin
    if (minX > 0) {
        viewboxX = gridCellWidth * Math.abs(minX);
    }
    // If xMin is negative, we need to adjust the viewboxX to be
    // the negative value of the grid cell width multiplied by xMin
    if (minX < 0) {
        viewboxX = -gridCellWidth * Math.abs(minX);
    }

    // Y RANGE
    let viewboxY = -height; // When yMin is 0, we want to use the negative value of the graph height
    const totalYRange = getRangeDiff(range[Y]);
    const gridCellHeight = height / totalYRange;
    const minY = range[Y][MIN];

    // If the y range is entirely positive, we want a negative sum of the
    // height and the gridcell height multiplied by the absolute value of yMin
    if (minY > 0) {
        viewboxY = -height - gridCellHeight * Math.abs(minY);
    }

    // If the yMin is negative, we want to multiply the gridcell height
    // by the absolute value of yMin, and subtract the full height of the graph
    if (minY < 0) {
        viewboxY = gridCellHeight * Math.abs(minY) - height;
    }

    return {
        viewboxX,
        viewboxY,
    };
};

const renderGraph = (props: {
    state: InteractiveGraphState;
    dispatch: (action: InteractiveGraphAction) => unknown;
}) => {
    const {state, dispatch} = props;
    const {type} = state;
    switch (type) {
        case "angle":
            return <AngleGraph graphState={state} dispatch={dispatch} />;
        case "segment":
            return <SegmentGraph graphState={state} dispatch={dispatch} />;
        case "linear-system":
            return <LinearSystemGraph graphState={state} dispatch={dispatch} />;
        case "linear":
            return <LinearGraph graphState={state} dispatch={dispatch} />;
        case "ray":
            return <RayGraph graphState={state} dispatch={dispatch} />;
        case "polygon":
            return <PolygonGraph graphState={state} dispatch={dispatch} />;
        case "point":
            return <PointGraph graphState={state} dispatch={dispatch} />;
        case "circle":
            return <CircleGraph graphState={state} dispatch={dispatch} />;
        case "quadratic":
            return <QuadraticGraph graphState={state} dispatch={dispatch} />;
        case "sinusoid":
            return <SinusoidGraph graphState={state} dispatch={dispatch} />;
        case "none":
            return null;
        default:
            throw new UnreachableCaseError(type);
    }
};
