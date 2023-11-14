import { AntDesign, Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {SafeAreaView, TouchableOpacity } from "react-native";
import Animated, { FadeInLeft, ZoomIn } from 'react-native-reanimated'
import { ImageBackground } from "react-native";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import {BlurView} from "expo-blur"
import { ScrollView } from "react-native";
import { weatherImages } from "./apiKey";

export default function App() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [Datas, setDatas]=useState([])
  const [current, setCurrent]=useState({})
  const [value, setValue] = useState("");
  const [dataSet, setDataSet] = useState(false);

  
  const responseSearch = async ()=>{
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/search.json?key=7741a9a23ebb40f8837124213231311&q=${value}`)
      setDatas(response.data)
      console.log(response.data);
    } catch (error) {
      console.log("error ", error);
    }
  } 

  const handleChange = async (item)=>{
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=7741a9a23ebb40f8837124213231311&q=${item === undefined?"tunis":item}&days=7&aqi=no&alerts=no`)
      if(response.status == 200){
        setCurrent(response.data)
        setValue("")
        setDataSet(true)
        setActive(false)
        console.log(response.data);
      }
    } catch (error) {
      console.log("error datas ", error);
    }
  }
console.log(current?.location?.country);
  useEffect(()=>{
    responseSearch()
    
  }, [value])

console.log(Datas.length);
  return (
    <ImageBackground
      blurRadius={10}
      source={require("./assets/mainBg.jpg")}
      style={{ height: "100%", width: "100%" }}
    >
      <SafeAreaView>
        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <View style={{  }}>
          <View style={{ flexDirection:active?'row':null, alignItems: active?"center":null }}>
          <TextInput
              style={{
               borderColor: "black",
                padding: 15,
                backgroundColor:'#D1D1D1',
                borderRadius:20, 
                width: "80%",
                marginRight:30,
                display:active?'flex':'none'}
              }
              onChangeText={(v)=>setValue(v)}
              value={value}
            />

            <View style={{marginLeft:active?null:328}}>
            <TouchableOpacity style={{backgroundColor:"#D1D1D1", padding:10, borderRadius:30}} onPress={()=>setActive(!active)}>
              <AntDesign name="search1" size={25} color="black"   />
            </TouchableOpacity>
            </View>
            
          </View>
          </View>
          {
            value.length >= 2 && (
              <View style={{backgroundColor:"#D1D1D1", position:"relative", marginTop:2, width:"80%", height:120, borderTopLeftRadius:20, borderBottomRightRadius:20}}>
                <ScrollView showsVerticalScrollIndicator={false}>
               {
                Datas.map((item, index)=>(
                  <TouchableOpacity key={index} onPress={()=>handleChange(item.name)}>
                  <Text style={{fontSize:15, padding:12}}>{item?.name}, {item?.country}</Text>
                  </TouchableOpacity>
                ))
               }
                </ScrollView>
              </View>
            )
          }

{
  dataSet?  (
    <View>
      <View style={{flexDirection:"row", alignItems:"baseline", marginTop:60, }}>
            <Text style={{fontSize:30}}>{current?.location?.name},</Text>
            <Text style={{fontSize:15, color:"gray"}}>{current?.location?.country}</Text>
          </View>
          <View>
          <View style={{flexDirection:"row", alignItems:"center", marginTop:20}}>
            <View>
            <Text style={{fontSize:80, marginRight:15}}>{current?.current?.temp_c}°</Text>
            <Text style={{fontSize:12, marginRight:15}}>{current?.location?.localtime} </Text>
            </View>
            <View style={{marginLeft:70}}>
            <Image source={weatherImages[current?.current?.condition?.text]} style={{width:160, height:150}} />

            </View>
          </View>
          <View style={{alignItems:"flex-end"}}>
          <Text style={{fontSize:20, fontWeight:"bold"}}>{current?.current?.condition?.text}</Text>
          </View>
          </View>
         <View style={{alignItems:"center", }}>
         <View style={{flexDirection:"row", alignItems:"center", gap:20, padding:35}}>
          <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
          <Fontisto name="wind" size={20} color="black" />
          <Text style={{fontSize:20}}>{current?.current?.wind_kph}km</Text>
          </View>
          <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
          <Ionicons name="water-outline" size={24} color="black" />
          <Text style={{fontSize:20}}>{current?.current?.humidity}%</Text>
          </View>
          <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
          <Feather name="sun" size={24} color="black" />
          <Text style={{fontSize:20}}>{current?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
          </View>
          </View>
         </View>

   <View>
   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection:'row', alignItems:"center", gap:10, marginBottom:15}}>
    {
      current?.forecast?.forecastday[0]?.hour?.map((item, index)=>{
        let date = new Date(item.time);
        let options = { hour: 'numeric', minute: 'numeric' };
        let timeString = date.toLocaleTimeString(undefined, options);
        return(
        <BlurView tint="dark" key={index}>
        <View style={{alignItems:"center", padding:10}}>
           <Text style={{color:"white"}}>{timeString}</Text>
        <Image source={weatherImages[item?.condition?.text]} style={{width:40, height:40}}  />
           <Text style={{color:"white", fontWeight:"bold", fontSize:15}}>{item.temp_c}°</Text>
           <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
           <Ionicons name="water-outline" size={20} color="white" />
             <Text style={{color:"white"}}>{item.humidity}%</Text>
           </View>
         </View>
        </BlurView>
        )
      }
      )
    }
        </View>
       </ScrollView>
   </View>

        
    </View>
  ):<View>
    <View style={{alignItems:"center", marginTop:50}}>
    <Text style={{fontSize:50}}>WELCOME TO ZEWEATHER APP</Text>
    </View>
  </View>
}
        </View>
        <StatusBar style="dark"  />
      </SafeAreaView>
      <View style={{flex:1, marginLeft:20, marginRight:20, marginBottom:50, display:dataSet?"flex":"none"}}>
          <View style={{flexDirection:"row", alignItems:"center", gap:15}}>
          <AntDesign name="calendar" size={24} color="white" />
          <Text style={{fontSize:20, color:"white"}}>Daily forecast</Text>
          </View>
          <View>
          <ScrollView showsVerticalScrollIndicator={false}>
        {
          current?.forecast?.forecastday?.map((item, index)=>{
            return(
              <View key={index} >
              <BlurView  intensity={30} tint="dark" style={{ padding:10, marginTop:15 }} >
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:20, color:"white"}}>{item?.date}</Text>
                 <Image source={weatherImages[item?.day?.condition?.text]} style={{width:40, height:40}}  />
                 <Text style={{fontSize:20, color:"white"}}>{item.day.avgtemp_c}°</Text>
                </View>
                 </BlurView>
                 <View style={{borderBottomWidth:2, borderColor:"white"}}></View>
              </View>
            )
          }) 
        }
          </ScrollView>
          </View>
         </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
