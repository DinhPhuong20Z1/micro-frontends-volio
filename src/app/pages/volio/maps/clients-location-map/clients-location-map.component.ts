import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Control } from 'leaflet';
import LayersOptions = Control.LayersOptions;


@Component({
    selector: 'ngx-clients-location-map',
    styleUrls: ['clients-location-map.component.scss'],
    template: `
    <nb-card>
        <nb-card-header>Clients Location Map</nb-card-header>
        <nb-card-body>
        <div leaflet style="height: 400px;"
                    (leafletMapReady)="onMapReady($event)"
                    [leafletOptions]="options"
                    [leafletBaseLayers]="baseLayers"
                    [leafletLayersControlOptions]="layersControlOptions"

                    [leafletMarkerCluster]="markerClusterData"
                    [leafletMarkerClusterOptions]="markerClusterOptions"
                    (leafletMarkerClusterReady)="markerClusterReady($event)">
            </div>
        </nb-card-body>
    </nb-card>`,
})
export class ClientsLocationMapComponent implements OnChanges {
    @Input() makers: {Lat: number, Lng: number}[] = [];

	LAYER_VVM = {
		id: 'openstreetmap',
		name: 'Volio VPN Monitor',
		enabled: false,
		layer:  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Volio VPN Monitor'
        }),
        zoom: 2,
        center: L.latLng({
            lat: 37.612873,
            lng: 33.810924
        }),
	};

	// Values to bind to Leaflet Directive
	layersControlOptions: LayersOptions = { position: 'bottomright' };
	baseLayers = {
		'Volio VPN Monitor': this.LAYER_VVM.layer
	};

	options = {
        layer:  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Volio VPN Monitor'
        }),
        zoom: 2,
        center: L.latLng({
            lat: 37.612873,
            lng: 33.810924
        }),
    };

	// Marker cluster stuff
	markerClusterGroup: L.MarkerClusterGroup;
	markerClusterData: L.Marker[] = [];
	markerClusterOptions: L.MarkerClusterGroupOptions;

	ngOnChanges(changes: SimpleChanges): void {
        if (!!this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
                this.refreshData();
            });
        }
    }

    private map;
    onMapReady(map: L.Map): void {
        this.map = map
        setTimeout(() => {
            map.invalidateSize();
            this.refreshData();
        }, 1000);

    }

	markerClusterReady(group: L.MarkerClusterGroup) {
		this.markerClusterGroup = group;
	}

	refreshData(): void {
		this.markerClusterData = this.generateData();
	}

	generateData(): L.Marker[] {
		const data: L.Marker[] = [];

		for (let idx in this.makers) {

			const icon = L.icon({
				iconSize: [ 25, 41 ],
				iconAnchor: [ 13, 41 ],
				iconUrl: 'assets/leaflet/marker-icon.png',
				iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
				shadowUrl: 'assets/leaflet/marker-shadow.png'
			});

			data.push(L.marker([ this.makers[idx].Lat, this.makers[idx].Lng ], { icon }).bindTooltip("Haha", {direction: "top", sticky: true, interactive: true}));
		}

		return data;

	}
}
