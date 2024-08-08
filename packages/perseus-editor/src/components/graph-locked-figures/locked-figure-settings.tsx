/**
 * LockedFigureSettings takes in a figure and renders the
 * respective settings for that figure type.
 *
 * Used in the interactive graph editor's locked figures section.
 */

import * as React from "react";

import LockedEllipseSettings from "./locked-ellipse-settings";
import LockedFunctionSettings from "./locked-function-settings";
import LockedLineSettings from "./locked-line-settings";
import LockedPointSettings from "./locked-point-settings";
import LockedPolygonSettings from "./locked-polygon-settings";
import LockedVectorSettings from "./locked-vector-settings";

import type {Props as LockedEllipseProps} from "./locked-ellipse-settings";
import type {LockedFigureSettingsMovementType} from "./locked-figure-settings-actions";
import type {Props as LockedFunctionProps} from "./locked-function-settings";
import type {Props as LockedLineProps} from "./locked-line-settings";
import type {Props as LockedPointProps} from "./locked-point-settings";
import type {Props as LockedPolygonProps} from "./locked-polygon-settings";
import type {Props as LockedVectorProps} from "./locked-vector-settings";

export type LockedFigureSettingsCommonProps = {
    // Whether to show the M2b features in the locked figure settings.
    // TODO(LEMS-2107): Remove this prop once the M2b flag is fully rolled out.
    showM2bFeatures?: boolean;

    // Movement props
    /**
     * Called when a movement button (top, up, down, bottom) is pressed.
     */
    onMove: (movement: LockedFigureSettingsMovementType) => void;
    /**
     * Called when the delete button is pressed.
     */
    onRemove: () => void;

    // Accordion props
    /**
     * Whether this accordion is expanded.
     */
    expanded?: boolean;
    /**
     * Called when the accordion is expanded or collapsed.
     */
    onToggle?: (expanded: boolean) => void;
};

// Union this type with other locked figure types when they are added.
type Props = LockedFigureSettingsCommonProps &
    (
        | LockedPointProps
        | LockedLineProps
        | LockedEllipseProps
        | LockedVectorProps
        | LockedPolygonProps
        | LockedFunctionProps
    );

const LockedFigureSettings = (props: Props) => {
    switch (props.type) {
        case "point":
            return <LockedPointSettings {...props} />;
        case "line":
            return <LockedLineSettings {...props} />;
        case "vector":
            return <LockedVectorSettings {...props} />;
        case "ellipse":
            return <LockedEllipseSettings {...props} />;
        case "polygon":
            return <LockedPolygonSettings {...props} />;
        case "function":
            if (props.showM2bFeatures) {
                return <LockedFunctionSettings {...props} />;
            }
            break;
    }

    return null;
};

export default LockedFigureSettings;
