// src/pages/MapsVectorPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { MapVector } from '../components/ui'
import mapsVectorData from '../data/maps-vector.json'

export default function MapsVectorPage() {
  // Helper to generate series for the world map scale
  const generateSeries = (data: any) => {
    if (!data.values) return undefined;

    return {
      regions: [{
        attribute: "fill",
        scale: {
          scale1: 'color-mix(in srgb, transparent, var(--tblr-primary) 10%)',
          scale2: 'color-mix(in srgb, transparent, var(--tblr-primary) 20%)',
          scale3: 'color-mix(in srgb, transparent, var(--tblr-primary) 30%)',
          scale4: 'color-mix(in srgb, transparent, var(--tblr-primary) 40%)',
          scale5: 'color-mix(in srgb, transparent, var(--tblr-primary) 50%)',
          scale6: 'color-mix(in srgb, transparent, var(--tblr-primary) 60%)',
          scale7: 'color-mix(in srgb, transparent, var(--tblr-primary) 70%)',
          scale8: 'color-mix(in srgb, transparent, var(--tblr-primary) 80%)',
          scale9: 'color-mix(in srgb, transparent, var(--tblr-primary) 90%)',
          scale10: 'color-mix(in srgb, transparent, var(--tblr-primary) 100%)',
        },
        values: data.values,
      }]
    };
  };

  const getMapProps = (id: string): any => {
    const data = (mapsVectorData as any)[id];
    if (!data) return { mapId: id, mapType: 'world' };

    return {
      mapId: id,
      mapType: data.map,
      series: generateSeries(data),
      markers: data.markers?.map((m: any) => {
        const coords = m.coords.split(',').map(Number);
        return {
          name: m.name,
          coords: [coords[0], coords[1]]
        };
      }),
      lines: data.lines,
      color: data.color || 'primary',
      lineStyle: {
        strokeDasharray: "4 4",
        animation: true,
        stroke: "rgba(98, 105, 118, .75)",
        strokeWidth: 0.5,
      },
      markerStyle: {
        initial: {
          r: 4,
          stroke: '#fff',
          opacity: 1,
          strokeWidth: 3,
          stokeOpacity: 0.5,
          fill: `var(--tblr-${data.color || 'primary'})`
        },
        hover: {
          fill: `var(--tblr-${data.color || 'primary'})`,
          stroke: `var(--tblr-${data.color || 'primary'})`
        }
      },
      markerLabelStyle: {
        initial: {
          fontSize: 10
        },
      },
      labels: {
        markers: {
          render: (marker: any) => marker.name
        }
      }
    };
  };

  const worldMercProps = getMapProps('world-merc');
  const worldMarkersProps = getMapProps('world-markers');
  const worldLinesProps = getMapProps('world-lines');

  return (
    <BaseLayout pageTitle="Vector Maps">
      <div className="row row-cards">
        {/* World Map */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">World map</h3>
              {worldMercProps && <MapVector {...worldMercProps} ratio="4x3" />}
            </div>
          </div>
        </div>

        {/* Map with markers */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Map with markers</h3>
              {worldMarkersProps && <MapVector {...worldMarkersProps} ratio="4x3" />}
            </div>
          </div>
        </div>

        {/* Map with markers and lines */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Map with markers and lines</h3>
              {worldLinesProps && <MapVector {...worldLinesProps} ratio="4x3" />}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
