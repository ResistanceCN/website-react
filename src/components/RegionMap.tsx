import React from 'react';
import './RegionMap.css';
import regions from './regions';

export default class RegionMap extends React.Component {
    state = {
        hint: '',
        hintStyle: {}
    };

    setHint(hint: string) {
        const rel = document.querySelector('.gm-style-mtc') as HTMLElement;

        this.setState({
            hint,
            hintStyle: {
                left: rel.parentElement !== null ? rel.parentElement!.offsetWidth + 20 : 0,
                display: hint === '' ? 'none' : 'block'
            }
        });
    }

    componentDidMount() {
        if (typeof google === 'undefined') {
            throw new Error('Google Maps SDK not loaded');
        }

        let map = new google.maps.Map(document.getElementById('region-map'), {
            center: new google.maps.LatLng(23.1, 113.3),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        map.data.addGeoJson(regions);

        map.data.setStyle((feature: google.maps.Data.Feature) => {
            let color = feature.getProperty('color');
            return {
                fillColor: color,
                strokeColor: color,
                strokeWeight: 2
            };
        });

        map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {
                strokeColor: 'white',
                strokeWeight: 3,
                zIndex: google.maps.Marker.MAX_ZINDEX
            });
            this.setHint(event.feature.getProperty('name'));
        });

        map.data.addListener('mouseout', (event: google.maps.Data.MouseEvent) => {
            map.data.revertStyle();
            this.setHint('');
        });

        map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
            // this.$emit('select', event);
        });
    }

    render() {
        return (
            <div id="region-map-container">
                <div id="region-map" />
                <div id="region-map-hint" style={this.state.hintStyle}>{this.state.hint}</div>
            </div>
        );
    }
}
