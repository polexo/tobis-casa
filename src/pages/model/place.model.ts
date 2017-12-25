
export class PlaceModel {
    desc: string;
    coords: { lat: string, lng: string };
    type: string;
    constructor() {
        this.coords = { lat: "", lng: "" };
        this.desc = "";
        this.type = "";
    }
    public isValid() {
        let isValid = false
        switch (this.type) {
            case PlaceModelTypes.mapType:
                isValid = this.coords.lat != '' && this.coords.lng != '';
                break;
            case PlaceModelTypes.geoType:
                isValid = this.coords.lat != '' && this.coords.lng != '';
                break;
            case PlaceModelTypes.placeType:
                isValid = this.desc != ''
                break;
        }
        return isValid;

    }
    public toRequestEntry() {
        let outValue;
        
        switch (this.type) {
            case PlaceModelTypes.mapType:
                outValue = new google.maps.LatLng(parseFloat(this.coords.lat), parseFloat(this.coords.lng));
                break;
            case PlaceModelTypes.geoType:
                outValue = new google.maps.LatLng(parseFloat(this.coords.lat), parseFloat(this.coords.lng));
                break;
            case PlaceModelTypes.placeType:
                outValue = this.desc;
                break;
        }
        return outValue;
    }
}
export const PlaceModelTypes = { mapType: "map", placeType: "place", geoType: "geo" };