import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';

export default function NovaOrdemScreen({ navigation }) {
  const [clienteNome, setClienteNome] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");
  const [produto, setProduto] = useState("");
  const [reclamacao, setReclamacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("pendente");
  const [dataEntrada, setDataEntrada] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const gerarNumeroOS = async () => {
    const contadorRef = doc(db, "contador", "contador_os");
    const contadorSnap = await getDoc(contadorRef);

    if (!contadorSnap.exists()) {
      Alert.alert("Erro", "Contador de OS não encontrado!");
      return null;
    }

    const novoNumeroOS = contadorSnap.data().contador_os + 1;
    await updateDoc(contadorRef, { contador_os: novoNumeroOS });

    return novoNumeroOS;
  };

  const handleSalvar = async () => {
    if (!clienteNome || !clienteTelefone || !produto || !reclamacao || !responsavel) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const numeroOS = await gerarNumeroOS();
    if (!numeroOS) return;

    try {
      await addDoc(collection(db, "ordens_servico"), {
        numero_os: numeroOS,
        cliente_nome: clienteNome,
        cliente_telefone: clienteTelefone,
        produto,
        reclamacao,
        responsavel,
        status,
        data_entrada: dataEntrada,
      });

      Alert.alert("Sucesso", "Ordem de Serviço cadastrada!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar OS:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a OS.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Ordem de Serviço</Text>

      <Text style={styles.label}>Cliente Nome</Text>
      <TextInput style={styles.input} value={clienteNome} onChangeText={setClienteNome} />

      <Text style={styles.label}>Cliente Telefone</Text>
      <TextInput style={styles.input} value={clienteTelefone} onChangeText={setClienteTelefone} keyboardType="phone-pad" />

      <Text style={styles.label}>Produto</Text>
      <TextInput style={styles.input} value={produto} onChangeText={setProduto} />

      <Text style={styles.label}>Reclamação</Text>
      <TextInput style={styles.input} value={reclamacao} onChangeText={setReclamacao} />

      <Text style={styles.label}>Responsável</Text>
      <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} />

      <Text style={styles.label}>Data de Entrada</Text>
      <TouchableOpacity style={styles.dataPicker} onPress={() => setShowPicker(true)}>
        <Text style={styles.dataTexto}>{dataEntrada.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={dataEntrada} mode="date" display="default" onChange={(event, selectedDate) => {
          setShowPicker(false);
          if (selectedDate) setDataEntrada(selectedDate);
        }} />
      )}

      <Button title="Salvar OS" onPress={handleSalvar} />
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
