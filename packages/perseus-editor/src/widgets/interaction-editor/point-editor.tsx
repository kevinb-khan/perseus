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
    coordX: string;
    coordY: string;
    color: string;
};

type DefaultProps = {
    coordX: Props["coordX"];
    coordY: Props["coordY"];
    color: Props["color"];
};

//
// Editor for non-interactive points
//
// TODO(eater): Factor this out
//
class PointEditor extends React.Component<Props> {
    static defaultProps: DefaultProps = {
        coordX: "0",
        coordY: "0",
        color: KhanColors.BLACK,
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
                    Coordinate: <TeX>\Large(</TeX>
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
                    <ColorPicker
                        value={this.props.color}
                        onChange={this.change("color")}
                    />
                </div>
            </div>
        );
    }
}

export default PointEditor;
