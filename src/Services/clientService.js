// clientService.js

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { collection, getDocs, query, where ,setDoc} from "firebase/firestore";
import {db} from "./firebase";
import { doc, getDoc,addDoc,updateDoc,arrayUnion } from "firebase/firestore";
const fetchCustomerData = async () => {
  const auth = getAuth();
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

      return {
        ...clientData,
        orderHistory: [], // Replace 'orderHistory' with actual orders data
        coupons: 3, // Example data
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
 * Signs in a user using email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise} A promise that resolves to the user credential object.
 */
 const signInClient = async (email, password) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };
// Add other client-related functions here...
const fetchShopOwners = async () => {
  try {
    const shopOwnersRef = collection(db, "ShopOwners");
    const querySnapshot = await getDocs(shopOwnersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching shop owners: ", error);
    throw error;
  }
};
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
      getCustomerCoupons
    };
