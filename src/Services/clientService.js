// clientService.js

import { getAuth, signInWithEmailAndPassword,signOut } from "firebase/auth";

import { collection, getDocs, query, where ,setDoc, or} from "firebase/firestore";
import { storage } from "./firebase"; // Assuming this is the correct path to your Firebase config
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

import {db} from "./firebase";
import { doc, getDoc,addDoc,updateDoc,arrayUnion } from "firebase/firestore";


const RateShopOwner = async (order, rating) => {
  const auth = getAuth();
  const user = auth.currentUser;


  const shopOwnerId = order.storeOwnerId;

if (!shopOwnerId) {
  console.error("Shop Owner ID is undefined.");
  return;
}

  if (!user) {
    console.error("No authenticated user found.");
    return;
  }
  const customerId = user.uid;


  // Prepare the new rating object
  const newRating = {
    ...rating,
    customerId,

  };

  // Correctly obtain a reference to the shop owner's document in the 'ratings' collection
  const ratingDocRef = doc(db, "ratings", shopOwnerId);
  
  try {
    // Check if the rating document for the shop owner exists
    const docSnap = await getDoc(ratingDocRef);
    if (docSnap.exists()) {
      // If the document exists, update it with the new rating
      await updateDoc(ratingDocRef, {
        ratings: arrayUnion(newRating)
      });
    } else {
      // If the document doesn't exist, create it with the new rating as the first item in the array
      await setDoc(ratingDocRef, {
        ratings: [newRating]
      });
    }
    console.log("Rating added successfully.");
  } catch (error) {
    console.error("Error adding rating:", error);
  }
};



const fetchCustomerOrders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const clientId = user.uid;

  try {
    // Fetch the shop owner's document to get the order IDs
    const docRef = doc(db, "Clients", clientId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("No client found with the given ID.");
    }

    const CustomerData = docSnap.data();
    const orderIds = CustomerData.orders; // Assuming 'orders' is the field with order IDs

    if (!orderIds || orderIds.length === 0) {
      return []; // Return an empty array if there are no orders
    }

    // Fetch each order by ID
    const orderPromises = orderIds.map(orderId => getDoc(doc(db, "orders", orderId)));
    const orderDocs = await Promise.all(orderPromises);
    let couponApplied=false ;
    // Map over each order document to construct order objects, including coupon details if available
    const orders = await Promise.all(orderDocs.map(async (docSnap) => {
      if (!docSnap.exists()) {
        console.warn(`No data found for order ID: ${docSnap.id}`);
        return null;
      }

      const orderData = docSnap.data();
      const shopOwnerRef=orderData.storeOwnerId;
      const shopOwnerSnap = await getDoc(doc(db, "ShopOwners", shopOwnerRef));
      if (!shopOwnerSnap.exists()) {
        console.warn(`No data found for shop owner ID: ${shopOwnerRef}`);
        return null;
      }
      orderData.shopOwnerName = shopOwnerSnap.data().fullName;
      orderData.shopPhone = shopOwnerSnap.data().storePhone; 
      // Check for a couponId and fetch coupon details if present
      let couponValue = 0; // Default to 0 if no coupon or if the coupon can't be found
      if (orderData.couponId) {
        const couponSnap = await getDoc(doc(db, "coupons", orderData.couponId));
        if (couponSnap.exists()) {
          // Assuming the coupon document has a field named 'value'
          couponValue = couponSnap.data().value;
          couponApplied = true;
      }
      }
      
      // Fetch flower details for each flower in the order's flowers array
      const flowersWithDetails = await Promise.all(orderData.flowers.map(async (flower) => {
        const flowerDocSnap = await getDoc(doc(db, "items", flower.id));
        if (!flowerDocSnap.exists()) {
          console.warn(`No data found for flower ID: ${flower.id}`);
          return null;
        }
        // Combine the flower details with the quantity from the order
        return { ...flowerDocSnap.data(), id: flowerDocSnap.id, quantity: flower.quantity };
      }));

      // Filter out any null values (for non-existent flowers)
      const flowers = flowersWithDetails.filter(flower => flower !== null);
      const sum = flowers.reduce((acc, flower) => acc + flower.price * flower.quantity, 0) - couponValue;
      
      // Fetch client data
      const clientRef = doc(db, "Clients", orderData.customerId);
      const clientSnap = await getDoc(clientRef);
      const clientData = clientSnap.data();
      orderData.client = clientData;

      // Return the order object with flower details, quantities, and couponValue included
      const applied= String(couponApplied);
      console.log(orderData);
      return { ...orderData, flowers, id: docSnap.id, totalCost :sum , couponApplied: applied};
    }));

    // Filter out any null values (non-existent orders)
    return orders.filter(order => order !== null);
  } catch (error) {
    console.error("Error fetching orders with flower details, quantity, and coupon value: ", error);
    throw error;
  }
};




const fetchCustomerData = async () => {
  const auth = await getAuth();
  console.log(auth.currentUser);
  if (auth.currentUser) {
 
    const docRef = doc(db, "Clients", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const clientData = docSnap.data();
      const orderIds = clientData.orderIds || []; // Assuming 'orderIds' is the field with the array of order IDs
      let orders = [];

      // Fetch each order by its ID
      for (const orderId of orderIds) {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        console.log(orderSnap);
        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          let flowersDetails = [];
          console.log(orderData.flowers);
          // Fetch each flower's details
          for (const flower of orderData.flowers) {
            const flowerRef = doc(db, "items", flower.id);
            const flowerSnap = await getDoc(flowerRef);

            if (flowerSnap.exists()) {
              flowersDetails.push({ 
                ...flowerSnap.data(), 
                quantity: flower.quantity 
              });
            } else {
              console.log(`No such document for flower ID: ${flower.id}`);
            }
          }

          orders.push({ ...orderData, flowers: flowersDetails });
        } else {
          console.log(`No such document for order ID: ${orderId}`);
        }
      }

        console.log(orders);
      // Assume 'currentOrder' is an ID and fetch its data
      let currentOrderData = {};
      if (clientData.currentOrder) {
        const currentOrderRef = doc(db, "orders", clientData.currentOrder);
        const currentOrderSnap = await getDoc(currentOrderRef);
        if (currentOrderSnap.exists()) {
          currentOrderData = currentOrderSnap.data();
        }
      }

      const couponsColRef = collection(db, "coupons");

      // Create a query against the collection for coupons matching the shopOwnerId and customerId
      const couponsQuery = query(couponsColRef, 

        where("customerId", "==", auth.currentUser.uid), 
        where("isUsed", "==", false) // Only fetch coupons that haven't been used
      );
  
      // Execute the query
      const querySnapshot = await getDocs(couponsQuery);
  
      // Map the results to an array of coupon data
      const coupons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

   

      return {
        ...clientData,
        orderHistory: [], // Replace 'orderHistory' with actual orders data
        coupons: coupons, // Example data
        orderStatus: currentOrderData.orderStatus, // Order status of the current order
      };
    } else {
      console.log("No such document!");
      return null;
    }
  }
  return null;
};


/**
 * Fetches coupons for a specific shop owner and the current customer.
 * 
 * @param {string} shopOwnerId - The ID of the shop owner.
 * @param {string} customerId - The ID of the current customer.
 * @returns {Promise<Array>} A promise that resolves to an array of coupon objects.
 */
const getCustomerCoupons = async (shopOwnerId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const customerId = user.uid;
  try {
    // Define the coupons collection reference
    const couponsColRef = collection(db, "coupons");

    // Create a query against the collection for coupons matching the shopOwnerId and customerId
    const couponsQuery = query(couponsColRef, 
      where("storeOwnerId", "==", shopOwnerId), 
      where("customerId", "==", customerId), 
      where("isUsed", "==", false) // Only fetch coupons that haven't been used
    );

    // Execute the query
    const querySnapshot = await getDocs(couponsQuery);

    // Map the results to an array of coupon data
    const coupons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Fetched coupons:", coupons);
    return coupons;
  } catch (error) {
    console.error("Error fetching coupons: ", error);
    throw error;
  }
};

const getPaymentDetails = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const clientId = user.uid;
  try {
    const docRef = doc(db, "Clients", clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().creditCard;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching client name: ", error);
  }
};



const getClientName = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const clientId = user.uid;
  try {
    const docRef = doc(db, "Clients", clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().firstName;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching client name: ", error);
  }
};
const saveCreditCardToFirebase = async (cardDetails) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  // Reference to the user's document in the Clients collection
  const clientRef = doc(db, "Clients", userId);

  try {
    // Update the user's document with the new credit card information
    // Here, we're saving the credit card details in a map within the document
    await updateDoc(clientRef, {
      // Assuming you want to store credit card details under a field named 'creditCard'
      'creditCard': {
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv,
        // As before, ensure you are aware of the security implications
      }
    });

    console.log("Credit card information saved successfully.");
  } catch (error) {
    console.error("Error saving credit card information: ", error);
  }
};



/**
 * Fetches flowers from the Firestore database.
 * @returns {Promise<Array>} A promise that resolves to an array of flowers.
 */
const fetchFlowersForShopOwner = async (shopOwnerId) => {
  try {
    // Fetch the shop owner's document
    const shopOwnerRef = doc(db, "ShopOwners", shopOwnerId);
    const shopOwnerSnap = await getDoc(shopOwnerRef);

    if (!shopOwnerSnap.exists()) {
      console.error("Shop owner not found");
      throw new Error("Shop owner not found");
    }

    const shopOwnerData = shopOwnerSnap.data();
    const flowerIds = shopOwnerData.inventory || [];

    // Fetch each flower in the inventory
    const flowers = [];
    for (const flowerId of flowerIds) {
      const flowerRef = doc(db, "items", flowerId);
      const flowerSnap = await getDoc(flowerRef);
      if (flowerSnap.exists()) {
        flowers.push({ id: flowerSnap.id, ...flowerSnap.data() });
      }
    }

    return flowers;
  } catch (error) {
    console.error("Error fetching flowers for shop owner: ", error);
    throw error;
  }
};
const fetchShopData = async (shopOwnerId) => {

  try {
    const shopOwnerRef = doc(db, "ShopOwners", shopOwnerId);
    const shopOwnerSnap = await getDoc(shopOwnerRef);
    if (shopOwnerSnap.exists()) {
      return shopOwnerSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching client name: ", error);
  }
}

/**
 * Signs in a user using email and password and checks if the client exists in Firestore.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise} A promise that resolves to the user credential object if the client exists.
 */
const signInClient = async (email, password) => {
  const auth = getAuth();
  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get a reference to the Firestore service

    
    // Assuming each client's document ID in the 'clients' collection is their user UID
    const clientDocRef = doc(db, "Clients", userCredential.user.uid);
    
    // Check if the client's document exists
    const docSnap = await getDoc(clientDocRef);
    if (!docSnap.exists()) {
      // If the document does not exist, sign the user out and throw an error
      await signOut(auth);
      throw new Error("Client does not exist in Firestore.");
    }
    
    // If everything is okay, return the user credential
    return userCredential;
  } catch (error) {
    // Handle errors, including sign in errors or Firestore errors
    console.error("Error signing in or checking client in Firestore:", error);
    throw error;
  }
};

// Fetch shop owners and their ratings
const fetchShopOwners = async () => {
  try {
    // Reference to the 'ShopOwners' collection
    const shopOwnersRef = collection(db, "ShopOwners");
    // Fetch all documents from the 'ShopOwners' collection
    const querySnapshot = await getDocs(shopOwnersRef);

    // Use Promise.all to fetch ratings for each shop owner in parallel
    const shopOwnersWithRatings = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
      const shopOwnerData = { id: docSnapshot.id, ...docSnapshot.data() };

      // Correctly reference the 'Ratings' document for the current shop owner
      // Make sure "ratings" is the correct collection name, and it matches your database structure
      const ratingsRef = doc(db, "ratings", shopOwnerData.id);

      // Fetch the ratings document
      const ratingsSnap = await getDoc(ratingsRef);
      
      // Check if the ratings document exists and add its data to the shop owner object
      if (ratingsSnap.exists()) {
        shopOwnerData.ratings = ratingsSnap.data();
        for (const rating of shopOwnerData.ratings.ratings) {
          const clientRef = doc(db, "Clients", rating.customerId);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            rating.customerName = clientSnap.data().firstName + " " + clientSnap.data().lastName;
          }
        }
        


      } else {
        // Set a default ratings value if no ratings document exists
        shopOwnerData.ratings = { average: 0, ratings:
          [ { customerName: "No ratings yet", rating: 0, comment: "No ratings yet" } ] };
      }
      console.log(shopOwnerData);
      // Calculate the average rating
      if (shopOwnerData.ratings.ratings && shopOwnerData.ratings.ratings.length > 0) {
        shopOwnerData.ratings.average = shopOwnerData.ratings.ratings.reduce((acc, curr) => acc + curr.rating, 0) / shopOwnerData.ratings.ratings.length;
      }
      return shopOwnerData;
    }));

    return shopOwnersWithRatings;
  } catch (error) {
    console.error("Error fetching shop owners: ", error);
    throw error;
  }
};

export default fetchShopOwners;

/**
 * Creates a new order with given details.
 * @param {string} storeOwnerId - ID of the store owner.
 * @param {string} customerId - ID of the customer.
 * @param {Array} flowerOrders - Array of flower orders, each with an ID and quantity.
 * @returns {Promise} A promise that resolves to the newly created order's document reference.
 */

const createOrder = async (storeOwnerId, flowerOrders, couponId = null) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const customerId = user.uid;

  try {
    // Validate input
    if (!storeOwnerId || !customerId || !Array.isArray(flowerOrders)) {
      throw new Error("Invalid input for order creation");
    }

    // Prepare order data
    const orderData = {
      storeOwnerId,
      customerId,
      flowers: flowerOrders,
      createdAt: new Date(),
      orderStatus: "paid",
      // Include couponId if provided
      ...(couponId && { couponId }), // Conditionally add couponId to the order
    };

    // Add the order to the 'orders' collection
    const ordersRef = collection(db, "orders");
    const orderRef = await addDoc(ordersRef, orderData);

    // If a couponId is provided, mark the coupon as used
    if (couponId) {
      const couponRef = doc(db, "coupons", couponId);
      const couponSnap = await getDoc(couponRef);

      if (couponSnap.exists()) {
        // Mark the coupon as used
        await updateDoc(couponRef, { isUsed: true });
      } else {
        console.log("No such coupon document!");
      }
    }

    // Update the shop owner's document with the new order ID
    const shopOwnerRef = doc(db, "ShopOwners", storeOwnerId);
    await updateDoc(shopOwnerRef, {
      orders: arrayUnion(orderRef.id)
    });

    // Update the client's document with the new order ID
    const clientRef = doc(db, "Clients", customerId);
    await updateDoc(clientRef, {
      orders: arrayUnion(orderRef.id),
      currentOrder: orderRef.id
    });

    return orderRef;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
};
const postApplication = async (applicant, shopId) => {
  try {
    const applicationRef = doc(db, "Applications", shopId);
    const docSnap = await getDoc(applicationRef);

    if (docSnap.exists()) {
      // If the document already exists, update it with the new application
      await updateDoc(applicationRef, {
        applications: arrayUnion(applicant)
      });
    } else {
      // If the document does not exist, create it with the initial application
      await setDoc(applicationRef, {
        applications: [applicant]
      });
    }
    console.log("Application submitted successfully with shopId as doc ID.");
  } catch (error) {
    console.error("Error submitting application:", error);
  }
};

const updateClient = async (client) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const clientId = user.uid;
  const clientRef = doc(db, "Clients", clientId);
  try {
    await updateDoc(clientRef, client);
    console.log("Client updated successfully.");
  } catch (error) {
    console.error("Error updating client:", error);
  }
}
const postFlowersToFirebase = async (flowers, wrapper, shopId, imageData) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const customerId = user.uid;

  try {
    if (!Array.isArray(flowers) || flowers.length === 0) {
      throw new Error("Invalid input for flowers");
    }

    if (!wrapper) {
      throw new Error("Invalid input for wrapper");
    }

    // Convert base64 image data to Blob
    const fetchResponse = await fetch(imageData);
    const blob = await fetchResponse.blob();

    // Upload the image to Firebase Storage
    const imageRef = storageRef(storage, `orderImages/${shopId}/${new Date().toISOString()}.png`);
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    // Prepare flower arrangement data with the cleaned values
    const flowerArrangementData = {
      customerId,
      flowers,
      wrapper,
      createdAt: new Date(),
      imageUrl, // Include the image URL in the document
      status: "paid",
      shopId
    };

    // Reference to the 'orders' collection
    const flowerArrangementsRef = collection(db, "borders");
    
    // Add a new document with the flower arrangement data
    const flowerArrangementRef = await addDoc(flowerArrangementsRef, flowerArrangementData);
    console.log("New flower arrangement and wrapper posted with ID: ", flowerArrangementRef.id);

    // Reference to the customer document
    const customerRef = doc(db, "Clients", customerId); // Adjust "Customers" to your actual customers collection name

    // Update the customer document to include the new order ID in the 'borders' array
    await updateDoc(customerRef, {
      borders: arrayUnion(flowerArrangementRef.id)
    });

    // Optionally, also update the shopOwner document as before
    const shopOwnerRef = doc(db, "ShopOwners", shopId);
    await updateDoc(shopOwnerRef, {
      borders: arrayUnion(flowerArrangementRef.id)
    });

    return flowerArrangementRef;
  } 
  
  catch (error) {
    console.error("Error posting flower arrangement and wrapper: ", error);
    throw error;
  }
};

const fetchBouquetOrders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found.");
    return [];
  }

  const ClientId = user.uid; // Assuming the shopOwnerId is the user's UID

  try {
    // First, fetch the shopOwner document to get the borders array
    const shopOwnerRef = doc(db, "Clients", ClientId);
    const shopOwnerSnap = await getDoc(shopOwnerRef);

    if (!shopOwnerSnap.exists()) {
      console.log("No such shopOwner document!");
      return [];
    }

    const shopOwnerData = shopOwnerSnap.data();
    const bordersIds = shopOwnerData.borders || [];

    // Fetch orders based on bordersIds
    const ordersPromises = bordersIds.map(async (orderId) => {
      const orderRef = doc(db, "borders", orderId);
      const orderSnap = await getDoc(orderRef);
      return orderSnap.exists() ? { id: orderSnap.id, ...orderSnap.data() } : null;
    });

    // Resolve all promises to get the orders
    const orders = await Promise.all(ordersPromises);
    const filteredOrders = orders.filter(order => order !== null); // Filter out any null values if order doesn't exist

    console.log("Fetched bouquet orders successfully:", filteredOrders);
    return filteredOrders;
  } 
  
  catch (error) {
    console.error("Error fetching bouquet orders:", error);
    return [];
  }
};

export {
  fetchFlowersForShopOwner,
  getPaymentDetails,
  signInClient,
  fetchShopOwners,
  getClientName,
  createOrder,
  fetchShopData ,
  fetchCustomerData,
  saveCreditCardToFirebase,
  getCustomerCoupons,
  fetchCustomerOrders,
  RateShopOwner,
  postApplication,
  updateClient, 
  postFlowersToFirebase,
  fetchBouquetOrders
};
