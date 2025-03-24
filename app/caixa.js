import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";

export default function CaixaScreen() {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    carregarDados();
  }, [mesSelecionado]);

  const carregarDados = async () => {
    try {
      const receitasRef = collection(db, "receitas");
      const despesasRef = collection(db, "despesas");

      const inicioMes = new Date(new Date().getFullYear(), mesSelecionado - 1, 1);
      const fimMes = new Date(new Date().getFullYear(), mesSelecionado, 0, 23, 59, 59);

      const qReceitas = query(receitasRef, where("data", ">=", inicioMes), where("data", "<=", fimMes));
      const qDespesas = query(despesasRef, where("data", ">=", inicioMes), where("data", "<=", fimMes));

      const receitasSnapshot = await getDocs(qReceitas);
      const despesasSnapshot = await getDocs(qDespesas);

      const receitasLista = receitasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const despesasLista = despesasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalReceitas = receitasLista.reduce((acc, item) => acc + (item.valor || 0), 0);
      const totalDespesas = despesasLista.reduce((acc, item) => acc + (item.valor || 0), 0);

      setReceitas(receitasLista);
      setDespesas(despesasLista);
      setSaldo(totalReceitas - totalDespesas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do caixa.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Caixa</Text>

      <Text style={styles.label}>Selecionar Mês:</Text>
      <Picker selectedValue={mesSelecionado} onValueChange={setMesSelecionado} style={styles.input}>
        {Array.from({ length: 12 }, (_, i) => (
          <Picker.Item key={i} label={format(new Date(2023, i, 1), "MMMM")} value={i + 1} />
        ))}
      </Picker>

      <Text style={[styles.saldo, saldo >= 0 ? styles.saldoPositivo : styles.saldoNegativo]}>
        Saldo: R$ {saldo.toFixed(2)}
      </Text>

      <Text style={styles.subtitulo}>Receitas</Text>
      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTexto}>{item.descricao}</Text>
            <Text style={styles.itemValor}>R$ {item.valor.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma receita cadastrada.</Text>}
      />

      <Text style={styles.subtitulo}>Despesas</Text>
      <FlatList
        data={despesas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTexto}>{item.descricao}</Text>
            <Text style={styles.itemValor}>R$ {item.valor.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma despesa cadastrada.</Text>}
      />
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
  saldo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  saldoPositivo: {
    color: "green",
  },
  saldoNegativo: {
    color: "red",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemTexto: {
    fontSize: 16,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  vazio: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },
});

