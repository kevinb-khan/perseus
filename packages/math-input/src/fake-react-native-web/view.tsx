import {StyleSheet, css} from "aphrodite";
import * as React from "react";

import type {StyleType} from "@khanacademy/wonder-blocks-core";
import type {CSSProperties} from "aphrodite";

type Props = {
    ariaLabel?: string;
    children?: React.ReactNode;
    // The `dynamicStyle` prop is provided for animating dynamic
    // properties, as creating Aphrodite StyleSheets in animation loops is
    // expensive. `dynamicStyle` should be a raw style object, rather than
    // a StyleSheet.
    dynamicStyle?: CSSProperties;
    // The `extraClassName` prop should almost never be used. It gives the
    // client a way to provide an additional CSS class name, to augment
    // the class name generated by Aphrodite. (Right now, it's only used to
    // disable some externally-applied CSS that would otherwise be far too
    // difficult to override with inline styles.)
    extraClassName?: string;
    numberOfLines?: number;
    onClick?: (arg1: React.SyntheticEvent<HTMLDivElement>) => void;
    onTouchCancel?: (arg1: React.TouchEvent<HTMLDivElement>) => void;
    onTouchEnd?: (arg1: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove?: (arg1: React.TouchEvent<HTMLDivElement>) => void;
    onTouchStart?: (arg1: React.TouchEvent<HTMLDivElement>) => void;
    role?: string;
    style?: StyleType;
    forwardRef?: React.RefObject<HTMLDivElement>;
};

class View extends React.Component<Props> {
    static styles = StyleSheet.create({
        // From: https://github.com/necolas/react-native-web/blob/master/src/components/View/index.js
        // eslint-disable-next-line react-native/no-unused-styles
        initial: {
            alignItems: "stretch",
            borderWidth: 0,
            borderStyle: "solid",
            boxSizing: "border-box",
            display: "flex",
            flexBasis: "auto",
            flexDirection: "column",
            margin: 0,
            padding: 0,
            position: "relative",
            // button and anchor reset
            backgroundColor: "transparent",
            color: "inherit",
            font: "inherit",
            textAlign: "inherit",
            textDecorationLine: "none",
            // list reset
            listStyle: "none",
            // fix flexbox bugs
            maxWidth: "100%",
            minHeight: 0,
            minWidth: 0,
        },
    });

    render(): React.ReactNode {
        const className =
            css(
                View.styles.initial,
                ...(Array.isArray(this.props.style)
                    ? this.props.style
                    : [this.props.style]),
            ) +
            (this.props.extraClassName ? ` ${this.props.extraClassName}` : "");

        return (
            <div
                className={className}
                style={this.props.dynamicStyle}
                onClick={this.props.onClick}
                onTouchCancel={this.props.onTouchCancel}
                onTouchEnd={this.props.onTouchEnd}
                onTouchMove={this.props.onTouchMove}
                onTouchStart={this.props.onTouchStart}
                aria-label={this.props.ariaLabel}
                role={this.props.role}
                ref={this.props.forwardRef}
            >
                {this.props.children}
            </div>
        );
    }
}

export default View;
