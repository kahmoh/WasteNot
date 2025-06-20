import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import NavigationBar from "./components/NavigationBar";
import "leaflet/dist/leaflet.css";
import './styles/Map.css'

const Map = () => {
    return (
        <div className="map-page-container">
            <NavigationBar/>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}
                      className={'map'}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
        </div>
    )
}

export default Map