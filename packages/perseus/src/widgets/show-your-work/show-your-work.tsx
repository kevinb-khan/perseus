/* eslint-disable no-console */
import {View} from "@khanacademy/wonder-blocks-core";
import {SingleSelect, OptionItem} from "@khanacademy/wonder-blocks-dropdown";
import {StyleSheet} from "aphrodite";
import React from "react";

import {combinedReducer} from "./reducer";
import {Step} from "./step";

import type {Mode} from "./reducer";

type Props = {
    question: string;
};

export const ShowYourWork = (props: Props) => {
    const [state, dispatch] = React.useReducer(combinedReducer, {
        mode: "Practice",
        steps: [
            {value: props.question, status: "ungraded"},
            {value: props.question, status: "ungraded"},
        ],
    });

    const {mode, steps} = state;

    return (
        <View style={styles.contentWrapper}>
            <SingleSelect
                placeholder="mode"
                selectedValue={state.mode}
                onChange={(selected) => {
                    dispatch({kind: "SwitchMode", mode: selected as Mode});
                }}
            >
                <OptionItem label="Practice" value="Practice" />
                <OptionItem label="Assessment" value="Assessment" />
            </SingleSelect>
            {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const disableCheck =
                    isLast &&
                    (steps[steps.length - 2].value ===
                        steps[steps.length - 1].value ||
                        steps[steps.length - 1].status === "wrong");

                return (
                    <Step
                        key={`${mode}-${i}}`}
                        step={step}
                        onChange={(step) => {
                            if (isLast) {
                                dispatch({kind: "Update", value: step.value});
                            }
                        }}
                        disableCheck={disableCheck}
                        onCheckStep={() => {
                            if (isLast) {
                                dispatch({kind: "Check"});
                            }
                        }}
                        onDeleteStep={() => {
                            dispatch({kind: "Delete"});
                        }}
                        isLast={isLast}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    contentWrapper: {},
});
