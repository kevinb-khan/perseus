import {
    components,
    Changeable,
    Dependencies,
    EditorJsonify,
    KhanColors,
    ColorPicker,
} from "@khanacademy/perseus";
import * as React from "react";
import _ from "underscore";

const {MathInput} = components;
const {getDependencies} = Dependencies;

type Props = Changeable.ChangeableProps & {
    color: string;
    coordX: string;
    coordY: string;
    height: string;
    width: string;
};

type DefaultProps = {
    color: Props["color"];
    coordX: Props["coordX"];
    coordY: Props["coordY"];
    height: Props["height"];
    width: Props["width"];
};

//
// Editor for rectangles
//
// TODO(eater): Factor this out maybe?
//
class RectangleEditor extends React.Component<Props> {
    static defaultProps: DefaultProps = {
        coordX: "-5",
        coordY: "5",
        width: "2",
        height: "3",
        color: KhanColors.LIGHT_BLUE,
    };

    change: (arg1: any, arg2?: any, arg3?: any) => any = (...args) => {
        return Changeable.change.apply(this, args);
    };

    serialize = () => {
        return EditorJsonify.serialize.call(this);
    };

    render(): React.ReactNode {
        const {TeX} = getDependencies();
        const analyticsStub = {onAnalyticsEvent: () => Promise.resolve()};

        return (
            <div className="graph-settings">
                <div className="perseus-widget-row">
                    Bottom left: <TeX>\Large(</TeX>
                    <MathInput
                        buttonsVisible="never"
                        value={this.props.coordX}
                        onChange={this.change("coordX")}
                        analytics={analyticsStub}
                    />
                    <TeX>,</TeX>{" "}
                    <MathInput
                        buttonsVisible="never"
                        value={this.props.coordY}
                        onChange={this.change("coordY")}
                        analytics={analyticsStub}
                    />
                    <TeX>\Large)</TeX>
                </div>
                <div className="perseus-widget-row">
                    Width:{" "}
                    <MathInput
                        buttonsVisible="never"
                        value={this.props.width}
                        onChange={this.change("width")}
                        analytics={analyticsStub}
                    />
                </div>
                <div className="perseus-widget-row">
                    Height:{" "}
                    <MathInput
                        buttonsVisible="never"
                        value={this.props.height}
                        onChange={this.change("height")}
                        analytics={analyticsStub}
                    />
                </div>
                <div className="perseus-widget-row">
                    <ColorPicker
                        value={this.props.color}
                        lightColors={true}
                        onChange={this.change("color")}
                    />
                </div>
                <div className="perseus-widget-row">
                    You want a border? Sorry, draw your own.
                </div>
            </div>
        );
    }
}

export default RectangleEditor;
