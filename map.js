import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, SafeAreaView, Text, Image,Modal } from 'react-native';

import MapView, { Callout, PROVIDER_GOOGLE, Marker, ProviderPropType, AnimatedRegion, MarkerAnimated, } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { LOC, PICK, SLOC } from '../../assets/images/index';
import Loader from '../../Components/Loader'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropdownAlert from 'react-native-dropdownalert';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapRef = React.createRef();

class MarkerTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 25.08817530021416,
      longitude: 55.19633583404324,
      data: this.props.route.params.data, 
      title: '',
      imgg: '',
      location: '',
      loading: false,
      showmodal:true,
      updatemodal:false,
    };
  }

  changeRegion(latitude, longitude) {
    //const latitude = 6.86;
    //const longitude = 6.86;
    //this.setState({ loading: true });
    this.setState({ latitude: latitude, longitude: longitude }, () => {
      this.handleGetDirections(latitude, longitude);
    });
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0121 * 5,
      longitudeDelta: 0.0121 * 5
    })
  }

  checklivelocation() {
    //const { latitude, longitude } = this.state;
    Geolocation.getCurrentPosition((position) => {
      this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
        this.handleGetDirections(position.coords.latitude, position.coords.longitude)
      });
      //console.log('checklivelocationlatitude>>>>>>',position.coords.latitude);
      //console.log('checklivelocationlongitude>>>>>>',position.coords.longitude);
      mapRef.current.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      })
    })
  }


  handleGetDirections = async (latitude, longitude) => {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD40NUXhii6ho2HPiQfUv9YB6KeFJr7nH0&latlng=' + latitude + ',' + longitude;
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((res) => {
        //console.log(res.results[0].address_components);
        if (res.results[1]) {
          for (var i = 0; i < res.results[0].address_components.length; i++) {
            for (var b = 0; b < res.results[0].address_components[i].types.length; b++) {
              //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (res.results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                city = res.results[0].address_components[i];
                break;
              }
            }
          }
        }
        //city data
        //alert(city.short_name + " " + city.long_name)
        if ( city.short_name == "Dubai" ){
          this.state.data.frm_city = "DXB";
        } else {
          this.state.data.frm_city = city.short_name;
        }
        
        if (this.state.data.srv_sys_id == 42) {
          if (this.state.data.trf_type == 'Departure') {
            this.state.data.to_locn = res.results[0].formatted_address;
          }
          if (this.state.data.trf_type == 'Arrival') {
            this.state.data.frm_locn = res.results[0].formatted_address;
          }
        }
        else {
          this.state.data.frm_locn = res.results[0].formatted_address;
        }
        this.setState({ location: res.results[0].formatted_address });
        this.setState({ data: this.state.data });
        this.setState({ loading: false });
      })
  }

  settitle = async (val) => {
    const { latitude, longitude, data } = this.state;
    switch (val) {
      case '34':
        this.setState({ title: 'Pickup Location', imgg: PICK });
        break;

      case 42:
        if (data.trf_type == 'Arrival') {
          this.setState({ title: 'Dropoff Location', imgg: LOC });
        }
        if (data.trf_type == 'Departure') {
          this.setState({ title: 'Pickup Location', imgg: PICK });
        }
        break;

      default:
        this.setState({ title: 'Location', imgg: SLOC });
    }
  }

  checkandredirect = async (val) => {
    const { latitude, longitude } = this.state;
    this.state.data.gps_latlng = latitude + ',' + longitude;
    switch (val) {
      case '34':
        this.props.navigation.navigate('Map1',
          { latt: latitude, longg: longitude, data: this.state.data })
        break;

      case 42:
        this.props.navigation.navigate('AirportForm', { latt: latitude, longg: longitude, data: this.state.data })
        break;

      case 56:
        this.props.navigation.navigate('RegForm', { latt: latitude, longg: longitude, data: this.state.data })
        break;

      default:
        this.props.navigation.navigate('Detailsform',
          { latt: latitude, longg: longitude, data: this.state.data })
    }
  }

  componentDidMount() {
    this.settitle(this.props.route.params.data.srv_sys_id)
    this.checklivelocation();
    this.props.navigation.addListener('focus', () => {
      if (this.props?.route?.params?.cords) {
        this.changeRegion(this.props.route.params.cords.lat, this.props.route.params.cords.lng);
      }
    });
    console.log('parked-data-prev>>>>>>', this.state.data);
  }


  render() {
    const { latitude, longitude, data, imgg, loading,showmodal } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {loading ? <Loader /> : null}
        <Modal
                    transparent={true}
                    visible={showmodal}
                >
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', flex: 1 }}>
                        <View style={{ backgroundColor: '#23222a', marginTop: 150, marginLeft: 50, marginRight: 50 }}>
                            <Text style={{ color: '#ffffff', margin: 20, fontFamily: 'Jura-Bold' }}>Info !!</Text>
                            <Text style={{ color: '#ffffff', marginLeft: 20, marginBottom: 20, fontFamily: 'Jura-Bold' }}>Please long press the marker to move.</Text>

                            <View style={{ backgroundColor: '#f2831d', flexDirection: 'row', justifyContent: 'flex-end', height: 50 }}>
                                <TouchableOpacity style={{ backgroundColor: '#f2831d' }}
                                    onPress={() => this.setState({showmodal:false})}>
                                    <Text style={{ color: '#ffffff', marginRight: 20, marginTop: 12, fontSize: 18, fontFamily: 'Jura-Bold' }}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
        <MapView
          //provider={this.props.provider}
          provider={Platform.OS === 'ios' ? '':PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          ref={mapRef}
          loadingEnabled={false}
          userLocationPriority={'high'}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsTraffic={false}
          zoomEnabled={true}
          zoomTapEnabled={true}
          zoomControlEnabled={true}
          rotateEnabled={true}
          scrollEnabled={true}
          toolbarEnabled={true}
          showsCompass={false}
          userInterfaceStyle={'dark'}
        >

          <MarkerAnimated
            coordinate={{ latitude: latitude, longitude: longitude }}
            onDragEnd={(e) => {
              //this.setState({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }); 
              //console.log('e.latitude', e.nativeEvent.coordinate.latitude);
              //console.log('e.longitude', e.nativeEvent.coordinate.longitude);
              this.changeRegion(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
            }}
            draggable
          //image={imgg}
          >
            <Image
              source={imgg}
              style={{ height: 90, marginTop: Platform.OS === 'ios' ? -90:0  }}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </MarkerAnimated>
        </MapView>

        <TouchableOpacity style={[styles.textfieldWrapper, { marginTop: 10 }]}
          onPress={() => this.props.navigation.navigate('MapSearch',
            { page: "map1" }
          )}>
          <Text style={styles.textfieldtitle}>{this.state.title}</Text>
          <Text style={{ color: '#ffffff', fontFamily: "Jura-Bold", marginTop: 10 }}>
            {this.state.location}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '50%',
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: 8,
            borderWidth: 1,
            borderColor: '#75747a',
            borderRadius: 50,
          }}
          onPress={() => this.checklivelocation()}>
          <Icon size={24} color={'#75747a'} name="crosshairs-gps" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '20%',
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            paddingTop: 8,
            paddingLeft: 14,
            borderWidth: 1,
            borderColor: '#75747a',
            width:35,
            height:35,
            borderRadius: 100,
          }}
          onPress={() => this.setState({showmodal:true})}>
          <FontAwesome5 name="info" size={15} style={{aliginSelf:"center"}} color={'#FF1493'} />
        </TouchableOpacity>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, bottom: Platform.OS === 'ios' ? 15 : 0, backgroundColor: '#23222a', padding: 10 }}>
          <View style={styles.Topupinfo}>
            <TouchableOpacity style={styles.loginScreenButton} onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.loginText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginScreenButton1}
              onPress={() => this.checkandredirect(this.state.data.srv_sys_id)}>
              <Text style={styles.loginText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>


      </SafeAreaView>
    );
  }
}

MarkerTypes.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    bottom: 60
  },
  Topupinfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  loginScreenButton: {
    backgroundColor: '#f2831d',
    width: '32%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    alignSelf: 'flex-end'
  },
  loginScreenButton1: {
    backgroundColor: '#f2831d',
    width: '65%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    alignSelf: 'flex-end'
  },
  loginText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: "Jura-Bold",
  },
  textfieldWrapper: {
    backgroundColor: '#23222a',
    paddingLeft: 20,
    paddingTop: 10,
    borderRadius: 10,
    height: 70,
    position: 'absolute',
    top: 0,
    width: width - 20,
    marginTop: 20
  },
  textfieldtitle: {
    color: '#f58020',
    marginBottom: Platform.OS === 'ios' ? 0 : -10,
    fontFamily: "Jura-Bold",
    fontSize: 12,
  },
});

export default MarkerTypes;
