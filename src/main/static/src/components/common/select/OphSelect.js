import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import './OphSelect.css';
import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';

const OphSelect = (props) => {
    return <VirtualizedSelect clearable={false} deleteRemoves={false} maxHeight={200} {...props} />;
};

export default OphSelect;
