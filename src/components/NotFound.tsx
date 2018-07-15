import React, { StatelessComponent } from 'react';

const NotFound: StatelessComponent<{}> = props => (
    <div className="center-container flex-spacer">
        <img
            src="/assets/img/salted-fish.svg"
            alt="404"
            style={{
                maxWidth: '50%',
                maxHeight: '50%',
                flex: '1'
            }}
        />
    </div>
);

export default NotFound;
