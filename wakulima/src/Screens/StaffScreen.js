
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { useTheme, Title, Card, Paragraph } from 'react-native-paper';
import firebase from '../components/firebase'; // Import your Firebase configuration

const StaffScreen = () => {
  const theme = useTheme();
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePromoteToAdmin = (salesperson) => {
    // Update user role to 'admin' in Firebase Firestore
    const userRef = firebase.firestore().collection('users').doc(salesperson.id);

    userRef
      .update({
        role: 'admin',
      })
      .then(() => {
        // Update the user's role locally
        setSalespersons((prevSalespersons) =>
          prevSalespersons.map((user) =>
            user.id === salesperson.id ? { ...user, role: 'admin' } : user
          )
        );
      })
      .catch((error) => {
        console.error('Error promoting to admin:', error);
      });
  };

  const handleDemoteToSalesperson = (admin) => {
    // Update user role to 'salesperson' in Firebase Firestore
    const userRef = firebase.firestore().collection('users').doc(admin.id);

    userRef
      .update({
        role: 'salesperson',
      })
      .then(() => {
        // Update the user's role locally
        setAdmins((prevAdmins) =>
          prevAdmins.map((user) =>
            user.id === admin.id ? { ...user, role: 'salesperson' } : user
          )
        );
      })
      .catch((error) => {
        console.error('Error demoting to salesperson:', error);
      });
  };

  useEffect(() => {
    // Fetch pending registrations from Firebase Firestore
    const pendingRegistrationsRef = firebase.firestore().collection('users').where('status', '==', 'Pending');

    pendingRegistrationsRef.onSnapshot((snapshot) => {
      const registrationData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        registrationData.push({ ...data, id: doc.id });
      });
      setPendingRegistrations(registrationData);
    });

    // Fetch admins from Firebase Firestore
    const adminsRef = firebase.firestore().collection('users').where('role', '==', 'admin');

    adminsRef.onSnapshot((snapshot) => {
      const adminData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        adminData.push({ ...data, id: doc.id });
      });
      setAdmins(adminData);
    });

    // Fetch salespersons from Firebase Firestore
    const salespersonsRef = firebase.firestore().collection('users').where('role', '==', 'salesperson');

    salespersonsRef.onSnapshot((snapshot) => {
      const salespersonData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        salespersonData.push({ ...data, id: doc.id });
      });
      setSalespersons(salespersonData);
    });
  }, []);

  const handleReviewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setModalVisible(true);
  };

  const handleApproveRegistration = (registration) => {
    // Update registration status in Firebase Firestore
    const registrationRef = firebase.firestore().collection('users').doc(registration.id);

    registrationRef
      .update({
        status: 'Approved',
      })
      .then(() => {
        // Remove the approved registration from the pending registrations list
        setPendingRegistrations((prevRegistrations) =>
          prevRegistrations.filter((reg) => reg.id !== registration.id)
        );
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error approving registration:', error);
      });
  };

  const renderUserList = (data) => {
    return (
      <FlatList
        data={data}
        numColumns={2} // Display cards in two columns
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            key={item.id}
            style={styles.card}
          >
            <Card.Content>
              <Paragraph style={styles.emailText}>Email: {item.email}</Paragraph>
              <Paragraph style={styles.roleText}>Role: {item.role}</Paragraph>
              {item.status === 'Pending' && (
                <TouchableOpacity
                  onPress={() => handleReviewRegistration(item)}
                  style={styles.reviewButton}
                >
                  <Text style={styles.buttonText}>Review</Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        )}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Admin Dashboard</Title>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Pending Registrations</Title>
        {renderUserList(pendingRegistrations)}
      </View>

      {admins.length > 0 && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Admins</Title>
          {renderUserList(admins)}
          {admins.map((admin) => (
            <View key={admin.id} style={styles.adminButtons}>
              <TouchableOpacity
                onPress={() => handleDemoteToSalesperson(admin)}
                style={styles.demoteButton}
              >
                <Text style={styles.buttonText}>Demote to Salesperson</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Salespersons</Title>
        {renderUserList(salespersons)}
          {salespersons.map((salesperson) => (
            <View key={salesperson.id} style={styles.adminButtons}>
              <TouchableOpacity
                onPress={() => handlePromoteToAdmin(salesperson)}
                style={styles.promoteButton}
              >
                <Text style={styles.buttonText}>Promote to Admin</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Title style={styles.modalTitle}>Review Registration</Title>
          {selectedRegistration && (
            <Card style={styles.modalCard}>
              <Card.Content>
                <Paragraph style={styles.emailText}>Email: {selectedRegistration.email}</Paragraph>
                <Paragraph style={styles.roleText}>Role: {selectedRegistration.role}</Paragraph>
                <TouchableOpacity
                  onPress={() => handleApproveRegistration(selectedRegistration)}
                  style={styles.approveButton}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  adminButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'orange', // Use your preferred button color
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 8,
  },
  promoteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'blue', // Use your preferred button color
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white', // Use your preferred background color
    borderRadius: 8,
    elevation: 2,
   
  },
  emailText: {
    fontSize: 16,
  },
  roleText: {
    fontSize: 16,
    marginTop: 8,
  },
  reviewButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'green', // Use your preferred button color
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
  },
  modalCard: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: 'white', // Use your preferred background color
    borderRadius: 8,
    elevation: 2,
  },
  approveButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'green', // Use your preferred button color
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'red', // Use your preferred button color
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default StaffScreen;

