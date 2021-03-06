// @flow
import "./FloatingBar.css";
import * as React from 'react';

type Props = {
    children: React.Node,
}

export const FloatingBar = (props: Props) => {
    return <div id="floating-bar"><span className="floating-bar-content">{props.children}</span></div>
};