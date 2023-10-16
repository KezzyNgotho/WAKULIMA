import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  useTheme,
  Title,
  Card,
  Paragraph,
  TextInput,
  Button,
  Snackbar
} from 'react-native-paper';
import firebase from '../components/firebase';
import MapView from 'react-native-maps'; // Import MapView and related components
import { useNavigation } from '@react-navigation/native';

const StaffScreen = () => {
  const theme = useTheme();
  const [salespersonRoutes, setSalespersonRoutes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // To track the selected user

  const navigation = useNavigation();
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [salesperson, setSalesperson] = useState(null);
  const [routeModalVisible, setRouteModalVisible] = useState(false);

  const [salespersonUsername , setSalesPersonUsername]=useState(false);
  const [assignedUsername, setAssignedUsername] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleAssignRoute = (user) => {
    setSelectedUser(user);
    setRouteModalVisible(true); // Open the "Assign Route" modal
  };
// Function to show a feedback alert
const showSnackbar = (message) => {
  setSnackbarMessage(message);
  setSnackbarVisible(true);
};

// Function to close the feedback alert
const closeSnackbar = () => {
  setSnackbarVisible(false);
};
  const openRouteModal = () => {
    setRouteModalVisible(true);
  };

  const closeRouteModal = () => {
    setRouteModalVisible(false);
  };
  const createNewRoute = async () => {
    try {
      // Validate input and create the route object
      if (!routeName || !assignedUsername) {
        setSnackbarMessage('Route name and assigned username are required.');
        setSnackbarVisible(true);
        return;
      }

      // Fetch the userId associated with the assigned username
      const userQuery = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', assignedUsername)
        .get();

      if (userQuery.empty) {
        setSnackbarMessage('User with the given username not found.');
        setSnackbarVisible(true);
        return;
      }

      const userId = userQuery.docs[0].id;

      const newRoute = {
        name: routeName,
        assignedUserId: userId,
      };

      // Send the new route data to your backend or Firebase Firestore
      await firebase.firestore().collection('routes').add(newRoute);

      // Handle success and display a success message
      setSnackbarMessage('Route created successfully.');
      setSnackbarVisible(true);

      // After successfully creating the route, close the modal
      closeRouteModal();
    } catch (error) {
      console.error('Error creating route:', error);
      setSnackbarMessage('Error creating route. Please try again.');
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    // Fetch pending registrations from Firebase Firestore
    const pendingRegistrationsRef = firebase
      .firestore()
      .collection('users')
      .where('status', '==', 'Pending');

    pendingRegistrationsRef.onSnapshot((snapshot) => {
      const registrationData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        registrationData.push({ ...data, id: doc.id });
      });
      setPendingRegistrations(registrationData);
    });

    // Fetch admins from Firebase Firestore
    const adminsRef = firebase
      .firestore()
      .collection('users')
      .where('role', '==', 'admin');

    adminsRef.onSnapshot((snapshot) => {
      const adminData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        adminData.push({ ...data, id: doc.id });
      });
      setAdmins(adminData);
    });

    // Fetch salespersons from Firebase Firestore
    const salespersonsRef = firebase
      .firestore()
      .collection('users')
      .where('role', '==', 'salesperson');

    salespersonsRef.onSnapshot((snapshot) => {
      const salespersonData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        salespersonData.push({ ...data, id: doc.id });
      });
      setSalespersons(salespersonData);
    });
  }, []);
   // Function to save data to Firebase Firestore under the salesperson's ID
   const saveDataToFirebase = () => {
    // Check if a salesperson is authenticated (assuming you have user authentication for salespersons)
    const salesperson = firebase.auth().currentUser;
  
    if (salesperson) {
      const salespersonId = salesperson.uid; // Get the salesperson's unique ID
  
      // Define and initialize salespersonUsername
    
  
      // Access the Firestore database
      const db = firebase.firestore();
  
      // Create a new document under the salesperson's ID with the data
      db.collection('salespersons')
        .doc(salespersonId)
        .collection('routes') // Create a subcollection for routes (optional)
        .add({
          salespersonUsername,
          
          // Add other data fields as needed
        })
        .then((docRef) => {
          console.log('Route created with ID: ', docRef.id);
  
          // Reset the input fields after successful data submission
          salespersonUsername('');
          
          // Navigate back to the previous screen or perform other actions
          navigation.goBack();
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    } else {
      // Handle the case where the salesperson is not authenticated
      console.error('Salesperson is not authenticated.');
    }
  };
  
  useEffect(() => {
    // Fetch routes for each salesperson and store them in state
    const fetchRoutesForSalespersons = async () => {
      const routesRef = firebase.firestore().collection('routes');

      // Fetch all routes
      const routesSnapshot = await routesRef.get();

      // Organize routes by salesperson
      const salespersonRoutesData = {};

      routesSnapshot.forEach((routeDoc) => {
        const routeData = routeDoc.data();
        const salespersonId = routeData.assignedUserId;

        if (!salespersonRoutesData[salespersonId]) {
          salespersonRoutesData[salespersonId] = [];
        }

        salespersonRoutesData[salespersonId].push({
          id: routeDoc.id,
          name: routeData.name,
        });
      });

      setSalespersonRoutes(salespersonRoutesData);
    };

    fetchRoutesForSalespersons();
  }, []);
  //handle review
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

  const renderUserList = (data, userRole) => {
    return (
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}> 
            <Card.Content>
              <Paragraph style={styles.emailText}>Email: {item.email}</Paragraph>
              <Paragraph style={styles.roleText}>Role: {item.role}</Paragraph>
              <Paragraph style={styles.emailText}>Name: {item.username}</Paragraph>
              <Title style={styles.routeTitle}>Routes:</Title>
              {salespersonRoutes[item.id] ? (
                salespersonRoutes[item.id].map((route) => (
                  <Text key={route.id}>{route.name}</Text>
                ))
              ) : (
                <Text>No routes assigned.</Text>
              )}

              {userRole === 'admin' && (
                <View>
                  <TouchableOpacity
                    onPress={() => handleDemoteToSalesperson(item)}
                    style={styles.demoteButton}
                  >
                    <Text style={styles.buttonText}>Demote to Salesperson</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEditDetails(item)}
                    style={styles.editButton} 
                  >
                    <Text style={styles.buttonText}>Edit Details</Text>
                  </TouchableOpacity>
                </View>
     ) }

              {userRole === 'salesperson' && (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    onPress={() => handlePromoteToAdmin(item)}
                    style={styles.assignRouteButton1} 
                  >
                    <Text style={styles.buttonText}>Promote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAssignRoute(item)}
                    style={styles.assignRouteButton}
                  >
                    <Text style={styles.buttonText}>Route</Text>
                  </TouchableOpacity>
                </View>
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

      {/* Pending Registrations */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Pending Registrations</Title>
        {/* ... render pending registrations ... */}
      </View>

      {admins.length > 0 && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Admins</Title>
          {renderUserList(admins, 'admin')}
        </View>
      )}

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Salespersons</Title>
        {renderUserList(salespersons, 'salesperson')}
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

      {/* User Details Modal */}
      <Modal
        visible={userDetailsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setUserDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Title style={styles.modalTitle}>User Details</Title>
          {selectedUser && (
            <Card style={styles.modalCard}>
              <Card.Content>
                <Paragraph style={styles.emailText}>Email: {selectedUser.email}</Paragraph>
                <Paragraph style={styles.roleText}>Role: {selectedUser.role}</Paragraph>
                <Paragraph style={styles.emailText}>Name: {selectedUser.username}</Paragraph>
                <Title style={styles.routeTitle}>Routes:</Title>
                {salespersonRoutes[selectedUser.id] ? (
                  salespersonRoutes[selectedUser.id].map((route) => (
                    <Text key={route.id}>{route.name}</Text>
                  ))
                ) : (
                  <Text>No routes assigned.</Text>
                )}
                <View style={styles.modalButtonContainer}>
                  {selectedUser.role === 'admin' && (
                    // Buttons for admin
                    <View>
                      <TouchableOpacity
                        onPress={() => handleDemoteToSalesperson(selectedUser)}
                        style={styles.demoteButton}
                      >
                        <Text style={styles.buttonText}>Demote to Salesperson</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {selectedUser.role === 'salesperson' && (
                    // Buttons for salesperson
                    <View style={styles.buttonsRow}>
                    <TouchableOpacity
                      onPress={() => handlePromoteToAdmin(selectedUser)}
                      style={styles.smallButton}
                    >
                      <Text style={styles.buttonText}>Promote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAssignRoute(selectedUser)}
                      style={styles.smallButton}
                    >
                      <Text style={styles.buttonText}>Assign Route</Text>
                    </TouchableOpacity>
                  </View>
                  
                  )}
                </View>
              </Card.Content>
            </Card>
          )}
        </View>
      </Modal>
      <Modal
        visible={routeModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeRouteModal}
      >
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Title style={styles.modalTitle}>Create New Route</Title>
              <TextInput
                label="Route Name"
                value={routeName}
                onChangeText={(text) => setRouteName(text)}
                style={styles.input}
              />
              <TextInput
                label="Assigned Username"
                value={assignedUsername}
                onChangeText={(text) => setAssignedUsername(text)}
                style={styles.input}
              />
              <Button mode="contained" onPress={createNewRoute} style={styles.button}>
                Create Route
              </Button>
              <Button
                mode="contained"
                onPress={closeRouteModal}
                style={styles.button}
              >
                Close
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

      {/* Feedback Alert (Snackbar) */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={closeSnackbar}
        duration={4000} // Adjust the duration as needed
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};


const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
   /*  alignItems: 'center',
    justifyContent: 'center', */
    
    paddingHorizontal:30,
  },
  modalCard: {
    width: '190%',
    paddingHorizontal:30, // Adjust the width as needed
  },
  modalTitle: {
    fontSize: 20,
    color: 'black',
  },
  input: {
    marginBottom: 10,
    backgroundColor:'transparent',
    borderWidth:1
  },
  button: {
    marginTop: 10,
    borderRadius:1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white', // Use your preferred background color
    borderRadius: 1,
    elevation: 1,
  },
  emailText: {
    fontSize: 16,
    color: 'black',
  },
  routeTitle: {
    fontSize: 16,
    color: 'black',
  },
  roleText: {
    fontSize: 16,
    marginTop: 8,
    color: 'black',
  },
  smallButton: {
    backgroundColor: 'green',
    marginRight: 9,
    borderRadius: 1,
    width: 100,
    height: 30,
  },
  assignRouteButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 2,
    alignItems: 'center',
  },
  assignRouteButton1: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 2,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  map: {
    height: 200,
    marginTop: 20,
  },
  adminButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'orange',
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 8,
  },
  promoteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: 'black',
  },
  modalCard: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  approveButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default StaffScreen;



