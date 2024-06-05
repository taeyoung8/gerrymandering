import React, { useState, useEffect, useMemo } from 'react';
import { TileLayer, MapContainer, GeoJSON, FeatureGroup, useMap } from 'react-leaflet';
import { rewind } from '../../Helpers/geojson.js';
import 'leaflet/dist/leaflet.css';
import './map.css';

const Map = ({ geojson, centerCoords, selectedFeatureBounds, setSelectedFeatureBounds, race, mode, height = '80vh' }) => {
  const [currentCoords, setCurrentCoords] = useState({ latitude: 0, longitude: 0 });

  const StateLayer = ({ data }) => {
    const map = useMap();
    const geoJsonStyle = useMemo(() => {
      return (color, i) => ({
        fillColor: color,
        color: 'black',
        dashArray: '0',
        cursor: 'pointer',
        fillOpacity: race !== undefined ? 0.65 : 0.8,
        weight: selectedFeatureBounds === i ? 6 : 2,
      });
    }, [selectedFeatureBounds]);

    const hasStateChanged = useMemo(() => {
      return currentCoords.latitude !== centerCoords.latitude && currentCoords.longitude !== centerCoords.longitude;
    }, [currentCoords, centerCoords]);

    useEffect(() => {
      if (hasStateChanged || selectedFeatureBounds === null) {
        map.flyTo({ lat: centerCoords.latitude, lng: centerCoords.longitude }, 7);
        setSelectedFeatureBounds(null);
        setCurrentCoords(centerCoords);
      }
    }, [centerCoords, selectedFeatureBounds]);

    useEffect(() => {
      if (selectedFeatureBounds !== null && !hasStateChanged) {
        const feature = JSON.parse(race !== undefined ? data[selectedFeatureBounds].geometry : data[selectedFeatureBounds]);
        const featureCoords = feature.coordinates[0][0];
        const bounds = { lat: featureCoords[1], lng: featureCoords[0] };
        map.flyTo(bounds, 9);
      }
    }, [selectedFeatureBounds]);

    return (
      <FeatureGroup>
        {data.map((obj, idx) => {
          const geoData = race !== undefined ? rewind(JSON.parse(obj.geometry), true) : JSON.parse(obj);
          return (
            <GeoJSON
              key={idx}
              data={geoData}
              style={geoJsonStyle(race !== undefined ? obj[race.toLowerCase() + 'Color'] : 'transparent', idx)}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(`${mode} Number: ${idx + 1}`);
                layer.on({
                  click: () => {
                    setSelectedFeatureBounds(idx);
                  },
                });
              }}
            />
          );
        })}
      </FeatureGroup>
    );
  };

  return (
    <>
      {geojson && (
        <MapContainer center={{ lat: centerCoords.latitude, lng: centerCoords.longitude }} zoom={7} style={{ height, width: '100%' }} minZoom={6}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <StateLayer data={geojson} />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
