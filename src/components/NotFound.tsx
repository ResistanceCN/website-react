import React, { StatelessComponent } from 'react';

const NotFound: StatelessComponent<{}> = props => (
    <div className="center-container flex-spacer">
        <img
            src="/assets/img/salted-fish-min.svg"
            alt="404"
            style={{
                maxWidth: '35%',
                maxHeight: '35%',
                flex: '1'
            }}
        />
    </div>
);

export default NotFound;
