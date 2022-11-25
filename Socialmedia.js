import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { facebook, pinterest, twitter, } from '../../assets/images/index';


class Social extends React.Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.PagetitleContainer}>
                    <Text style={styles.Pagetitle}>Social Media</Text>
                </View>

                <View style={styles.Topupinfocontainer}>
                    <View style={styles.Topupinfo}>
                        <TouchableOpacity
                        style={styles.footernewbutton}
                        onPress={ ()=>{ this.props.navigation.navigate(
                          'Browser',
                          { url: 'https://www.facebook.com/MotoringClubUAE/' }
                          ) }}
                        >
                            <Image source={facebook} style={styles.tickcss} resizeMode={'contain'} />
                            <Text style={styles.loginText}>facebook</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.footernewbutton}
                        onPress={ ()=>{ this.props.navigation.navigate(
                          'Browser',
                          { url: 'https://twitter.com/MotoringClub' }
                          ) }}
                        >
                            <Image source={twitter} style={styles.tickcss} resizeMode={'contain'} />
                            <Text style={styles.loginText}>Twitter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.footernewbutton}
                        onPress={ ()=>{ this.props.navigation.navigate(
                          'Browser',
                          { url: 'https://www.pinterest.com/MotoringClub/' }
                          ) }}
                        >
                            <Image source={pinterest} style={styles.tickcss} resizeMode={'contain'} />
                            <Text style={styles.loginText}>Pinterest</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
              style={styles.footerbackhistorybutton}
              onPress={() => this.props.navigation.navigate('Dashboard')}
            >
              <Text style={styles.loginTextback}>Back</Text>
            </TouchableOpacity>



            
            </ScrollView>
        </SafeAreaView>
    );
  }
}

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23222a',
    padding: 20
  },
  PagetitleContainer: {
    marginBottom: 10
  },
  Pagetitle: {
    color: '#f58020',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: "Jura-Bold",
  },
  Topupinfocontainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  Topupinfo: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  tickcss: {
      width: 50,
      height: 50,
  },
  footernewbutton: {
     alignItems: 'center',
     width: '33%',
  },
  loginText: {
      color: '#ffffff',
      fontSize: 10,
      fontFamily: "Jura-Bold",
  },
  footerbackhistorybutton: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2831d',
    borderRadius: 10,
    marginTop: 60,
  },
  loginTextback: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: "Jura-Bold",
  }
});

export default Social;