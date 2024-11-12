import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const KomponenPemilihGambar = () => 
{
  const [gambarUri, aturGambarUri] = useState("");

  const bukaPemilihGambar = async () => 
  {
    const izinMedia = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!izinMedia.granted) 
    {
      Alert.alert("Izin diperlukan", "Anda perlu mengaktifkan izin untuk mengakses galeri foto.");
      return;
    }

    const responsGambar = await ImagePicker.launchImageLibraryAsync(
    {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log("Respons Pemilih Gambar:", responsGambar);
    tanganiResponsGambar(responsGambar);
  };

  const bukaKamera = async () => 
  {
    const izinKamera = await ImagePicker.requestCameraPermissionsAsync();

    if (!izinKamera.granted) 
    {
      Alert.alert("Izin diperlukan", "Anda perlu mengaktifkan izin untuk mengakses kamera.");
      return;
    }

    const responsKamera = await ImagePicker.launchCameraAsync(
    {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log("Respons Kamera:", responsKamera);
    tanganiResponsGambar(responsKamera);
  };

  const tanganiResponsGambar = (respons) => 
  {
    if (respons.canceled) 
    {
      console.log("Pengguna membatalkan pemilihan gambar");
    } 
    else if (respons.assets && respons.assets.length > 0) 
    {
      const uriGambar = respons.assets[0].uri;
      aturGambarUri(uriGambar);
      console.log("URI Gambar:", uriGambar);
    } 
    else 
    {
      console.log("URI gambar tidak ditemukan dalam respons");
      Alert.alert("Kesalahan", "Gagal mengambil URI gambar.");
    }
  };

  const simpanKeGaleri = async () => 
  {
    if (!gambarUri) 
    {
      Alert.alert("Tidak ada gambar untuk disimpan", "Silakan ambil atau pilih gambar terlebih dahulu.");
      return;
    }

    const izinGaleri = await MediaLibrary.requestPermissionsAsync();
    if (!izinGaleri.granted) 
    {
      Alert.alert("Izin diperlukan", "Anda perlu mengaktifkan izin untuk menyimpan gambar ke galeri.");
      return;
    }

    try 
    {
      const aset = await MediaLibrary.createAssetAsync(gambarUri);
      await MediaLibrary.createAlbumAsync("Galeri", aset, false);
      Alert.alert("Gambar disimpan!", "Gambar telah disimpan ke Galeri.");
      console.log("Gambar disimpan ke Galeri:", aset.uri);
    } 
    catch (error) 
    {
      console.error("Kesalahan saat menyimpan gambar:", error);
      Alert.alert("Kesalahan Simpan", "Gagal menyimpan gambar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Beverly Vladislav Tan - 00000075026</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Buka Kamera" onPress={bukaKamera} color="#40b5d6" />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Buka Galeri" onPress={bukaPemilihGambar} color="#40b5d6" />
      </View>
      
      {gambarUri ? (
        <>
          <Image source={{ uri: gambarUri }} style={styles.gambar} />
          <View style={styles.buttonContainer}>
            <Button title="Simpan Gambar" onPress={simpanKeGaleri} color="#40b5d6" />
          </View>
        </>
      ) : (
        <Text style={styles.text}>Tidak ada gambar yang dipilih</Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create(
{
  container: 
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  gambar: 
  {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10
  },
  buttonContainer: 
  {
    marginBottom: 10,
    marginTop: 10,
    width: '70%'
  },
  text: 
  {
    marginBottom: 20,
    textAlign: 'center'
  }
});

export default KomponenPemilihGambar;
