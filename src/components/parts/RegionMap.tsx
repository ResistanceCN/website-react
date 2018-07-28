import './RegionMap.css';
import React, { CSSProperties } from 'react';
import { geojson } from '../../libs/regions';

interface RegionMapProps {
    onSelect(event: google.maps.Data.MouseEvent): void;
}

interface RegionMapState {
    hint: string;
    hintStyle: CSSProperties;
    mapError: boolean;
}

export default class RegionMap extends React.Component<RegionMapProps, RegionMapState> {
    state = {
        hint: '',
        hintStyle: {},
        mapError: false
    };

    mapContainer: HTMLDivElement;
    mapEventListeners: Array<google.maps.MapsEventListener> = [];

    setHint(hint: string) {
        const el = GoogleMap.instance().getDiv().querySelector('.gm-style-mtc');
        const parent = el === null ? null : el.parentElement;

        this.setState({
            hint,
            hintStyle: {
                left: parent === null ? 0 : parent.offsetWidth + 20,
                display: hint === '' ? 'none' : 'block'
            }
        });
    }

    async componentDidMount() {
        try {
            await GoogleMap.loaded;

            const map = GoogleMap.instance();

            this.mapEventListeners = [
                map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
                    map.data.revertStyle();
                    map.data.overrideStyle(event.feature, {
                        strokeColor: 'white',
                        strokeWeight: 3,
                        zIndex: google.maps.Marker.MAX_ZINDEX
                    });
                    this.setHint(event.feature.getProperty('name'));
                }),

                map.data.addListener('mouseout', (event: google.maps.Data.MouseEvent) => {
                    map.data.revertStyle();
                    this.setHint('');
                }),

                map.data.addListener('click', this.props.onSelect)
            ];

            this.mapContainer.appendChild(map.getDiv());
        } catch (e) {
            this.setState({
                mapError: true
            });
        }
    }

    componentWillUnmount() {
        try {
            this.mapEventListeners.splice(0).forEach(l => l.remove());
            GoogleMap.instance().getDiv().remove();
        } catch (e) {
            // @TODO
        }
    }

    render() {
        if (this.state.mapError) {
            return <div className="map-error">Google 地图加载失败</div>;
        }

        return (
            <div id="region-map-container" ref={ref => this.mapContainer = ref!}>
                <div id="region-map-hint" style={this.state.hintStyle}>{this.state.hint}</div>
            </div>
        );
    }
}

// https://stackoverflow.com/questions/10485582/what-is-the-proper-way-to-destroy-a-map-instance
class GoogleMap {
    protected static map: google.maps.Map;

    protected static create() {
        let target = document.createElement('div');
        target.id = 'region-map';

        const map = new google.maps.Map(target, {
            center: new google.maps.LatLng(23.1, 113.3),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        map.data.addGeoJson(geojson);

        map.data.setStyle((feature: google.maps.Data.Feature) => {
            const color = feature.getProperty('color');
            return {
                fillColor: color,
                strokeColor: color,
                strokeWeight: 2
            };
        });

        GoogleMap.map = map;
    }

    static instance(): google.maps.Map {
        if (typeof GoogleMap.map === 'undefined') {
            GoogleMap.create();
        }

        return GoogleMap.map;
    }

    static loaded = new Promise((resolve, reject) => {
        const wait = () => {
            switch (asyncScripts.map) {
                case ScriptStatus.Failed:
                    reject();
                    // tslint:disable-next-line
                    console.error('Cannot load Google Maps SDK');
                    break;

                case ScriptStatus.Success:
                    resolve();
                    break;

                case ScriptStatus.Loading:
                    setTimeout(wait, 200);
            }
        };

        wait();
    });
}
