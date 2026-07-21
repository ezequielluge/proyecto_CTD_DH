import React, { useState } from 'react';

const FeatureSelector = ({ featuresData, initialSelectedIds }) => {
    const [selected, setSelected] = useState(initialSelectedIds || []);

    const handleToggle = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(fid => fid !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label small fw-bold">Características del Alojamiento</label>
            <div className="row border rounded p-2 mx-0 bg-light">
                {featuresData.map(feature => (
                    <div key={feature.id} className="col-md-4 col-sm-6 mb-2">
                        <div className="form-check">
                            <input 
                                className="form-check-input feature-checkbox" 
                                type="checkbox" 
                                value={feature.id} 
                                id={`feature-${feature.id}`}
                                checked={selected.includes(feature.id)}
                                onChange={() => handleToggle(feature.id)}
                            />
                            <label className="form-check-label small" htmlFor={`feature-${feature.id}`}>
                                <i className={`fa-solid ${feature.icon} me-1`}></i> {feature.name}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureSelector;