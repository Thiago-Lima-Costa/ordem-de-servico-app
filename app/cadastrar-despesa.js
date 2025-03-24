import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CadastrarDespesaScreen({ navigation }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSalvar = async () => {
    if (!descricao || !valor) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "despesas"), {
        descricao,
        valor: parseFloat(valor),
        data
      });

      Alert.alert("Sucesso", "Despesa cadastrada com sucesso!");
      if (navigation) navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a despesa.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Despesa</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />

      <Text style={styles.label}>Valor</Text>
      <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="numeric" />

      <Text style={styles.label}>Data</Text>
      <TouchableOpacity style={styles.dataPicker} onPress={() => setShowPicker(true)}>
        <Text style={styles.dataTexto}>{data.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={data} mode="date" display="default" onChange={(event, selectedDate) => {
          setShowPicker(false);
          if (selectedDate) setData(selectedDate);
        }} />
      )}

      <Button title="Salvar Despesa" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  dataPicker: {
    height: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dataTexto: {
    fontSize: 16,
    color: "#555",
  },
});
