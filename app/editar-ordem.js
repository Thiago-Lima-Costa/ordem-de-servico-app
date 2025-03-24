import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export default function EditarOrdemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [ordem, setOrdem] = useState(null);
  const [dataSaida, setDataSaida] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const carregarOrdem = async () => {
      try {
        const docRef = doc(db, "ordens_servico", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const osData = { id: docSnap.id, ...docSnap.data() };
          setOrdem(osData);

          if (osData.data_saida) {
            setDataSaida(new Date(osData.data_saida.seconds * 1000));
          }
        } else {
          Alert.alert("Erro", "Ordem de Serviço não encontrada.");
          router.back();
        }
      } catch (error) {
        console.error("Erro ao carregar OS:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarOrdem();
  }, [id]);

  const atualizarOS = async () => {
    if (!ordem.cliente_nome || !ordem.produto || !ordem.reclamacao || !ordem.responsavel) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const docRef = doc(db, "ordens_servico", id);
      await updateDoc(docRef, {
        ...ordem,
        valor_servico: ordem.valor_servico ? parseFloat(ordem.valor_servico) : 0,
        data_saida: dataSaida ? Timestamp.fromDate(dataSaida) : null,
      });

      Alert.alert("Sucesso", "Ordem de Serviço atualizada!");
      router.push("/ordens");
    } catch (error) {
      console.error("Erro ao atualizar OS:", error);
      Alert.alert("Erro", "Não foi possível atualizar a OS.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataSaida(selectedDate);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Ordem de Serviço</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={ordem.cliente_nome}
        onChangeText={(text) => setOrdem({ ...ordem, cliente_nome: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone do Cliente"
        value={ordem.cliente_telefone}
        onChangeText={(text) => setOrdem({ ...ordem, cliente_telefone: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Produto"
        value={ordem.produto}
        onChangeText={(text) => setOrdem({ ...ordem, produto: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Reclamação"
        value={ordem.reclamacao}
        onChangeText={(text) => setOrdem({ ...ordem, reclamacao: text })}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Responsável"
        value={ordem.responsavel}
        onChangeText={(text) => setOrdem({ ...ordem, responsavel: text })}
      />

      {/* Seletor de Status */}
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={ordem.status}
        onValueChange={(value) => setOrdem({ ...ordem, status: value })}
        style={styles.input}
      >
        <Picker.Item label="Pendente" value="Pendente" />
        <Picker.Item label="Orçamento Realizado" value="Orçamento Realizado" />
        <Picker.Item label="Serviço Autorizado" value="Serviço Autorizado" />
        <Picker.Item label="Concluído" value="Concluído" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Diagnóstico"
        value={ordem.diagnostico}
        onChangeText={(text) => setOrdem({ ...ordem, diagnostico: text })}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Valor do Serviço"
        value={ordem.valor_servico ? ordem.valor_servico.toString() : ""}
        onChangeText={(text) => setOrdem({ ...ordem, valor_servico: text })}
        keyboardType="numeric"
      />

      {/* Date Picker */}
      <Text style={styles.label}>Data de Saída</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{dataSaida ? dataSaida.toLocaleDateString() : "Selecionar Data de Saída"}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dataSaida || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.botao} onPress={atualizarOS}>
        <Text style={styles.botaoTexto}>Atualizar OS</Text>
      </TouchableOpacity>
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
    justifyContent: "center",
  },
  botao: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
