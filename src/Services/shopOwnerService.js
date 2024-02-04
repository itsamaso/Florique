// ShopOwnerService.js

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection ,deleteDoc,arrayRemove,setDoc,query,where,documentId,getDocs} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Assuming this is the correct path to your Firebase config
// Other imports remain the same

/**
 * Signs in a shop owner using email and password.
 * @param {string} email - Shop owner's email.
 * @param {string} password - Shop owner's password.
 * @returns {Promise} A promise that resolves to the user credential object.
 */
const signInShopOwner = async (email, password) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log("User logged in: ", userCredential.user);
  auth.currentUser = userCredential.user;
  return userCredential;
};

/**
 * Adds a new flower to the Firestore database and updates the shop owner's inventory.
 * @param {string} shopOwnerId - The ID of the shop owner.
 * @param {Object} flowerData - The data for the new flower.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const addFlower = async (shopOwnerId, flowerData, file) => {
  try {
    // First, upload the image to Firebase Storage
    if (file) {
      const imageRef = storageRef(storage, `flowers/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);
      flowerData.image = imageUrl;
    }

    // Remove the id field from flowerData if it exists
    const { id, ...flowerDataWithoutId } = flowerData;

    // Add the new flower to the "flowers" collection with the image URL
    const flowerRef = await addDoc(collection(db, "items"), flowerDataWithoutId);
    console.log("New flower added with ID:", flowerRef.id);

    // Update the shop owner's inventory to include the new flower ID
    const shopOwnerRef = doc(db, "ShopOwners", shopOwnerId);
    await updateDoc(shopOwnerRef, {
      inventory: arrayUnion(flowerRef.id)
    });
    console.log("Shop owner's inventory updated.");
  } catch (error) {
    console.error("Error adding flower: ", error);
    throw error;
  }
};


/**
 * Fetches the inventory for a specific shop owner from Firestore.
 * @param {string} shopOwnerId - The ID of the shop owner.
 * @returns {Promise<Array>} A promise that resolves to an array of flower objects.
 */
const fetchInventoryForShopOwner = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const shopOwnerId = user.uid;

    try {
      const shopOwnerRef = doc(db, "ShopOwners", shopOwnerId);
      const shopOwnerSnap = await getDoc(shopOwnerRef);
  
      if (!shopOwnerSnap.exists()) {
        console.error("Shop owner not found");
        throw new Error("Shop owner not found");
      }
  
      const shopOwnerData = shopOwnerSnap.data();
      const inventoryIds = shopOwnerData.inventory || [];
      
      // Fetch each flower in the inventory
      const flowers = [];
      for (const flowerId of inventoryIds) {
        const flowerRef = doc(db, "items", flowerId);
        const flowerSnap = await getDoc(flowerRef);
        if (flowerSnap.exists()) {
          flowers.push({ id: flowerSnap.id, ...flowerSnap.data() });
        }
      }
  
      return flowers;
    } catch (error) {
      console.error("Error fetching inventory for shop owner: ", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  /**
 * Fetches orders based on the order IDs in the shop owner's document.
 * @param {string} shopOwnerId - The ID of the shop owner to fetch orders for.
 * @returns {Promise<Array>} A promise that resolves to an array of order objects.
 */

  const fetchOrdersWithFlowerDetails = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const shopOwnerId = user.uid;
  
    try {
      // Fetch the shop owner's document to get the order IDs
      const docRef = doc(db, "ShopOwners", shopOwnerId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error("No shop owner found with the given ID.");
      }
  
      const shopOwnerData = docSnap.data();
      const orderIds = shopOwnerData.orders; // Assuming 'orders' is the field with order IDs
  
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
        console.log(applied);
        return { ...orderData, flowers, id: docSnap.id, totalCost :sum , couponApplied: applied};
      }));
  
      // Filter out any null values (non-existent orders)
      return orders.filter(order => order !== null);
    } catch (error) {
      console.error("Error fetching orders with flower details, quantity, and coupon value: ", error);
      throw error;
    }
  };

/**
 * Fetches data for the current shop owner.
 * @returns {Promise<Object>} A promise that resolves to the shop owner's data.
 */
const fetchShopOwnerData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in.");
  
      const docRef = doc(db, "ShopOwners", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error("No shop owner data found.");
      }
  
      return docSnap.data(); // Return the document data
    } catch (error) {
      console.error("Error fetching shop owner data: ", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };


/**
 * Edits an existing flower's details in the Firestore database.
 * @param {string} flowerId - The ID of the flower to edit.
 * @param {Object} flowerData - The updated data for the flower.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const editFlower = async (shopOwnerId, flowerId, flowerData, file) => {
  try {
    // If there's a new file, upload it to Firebase Storage
    let imageUrl = flowerData.image;
    if (file) {
      const imageRef = storageRef(storage, `flowers/${shopOwnerId}/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Update the flower document in Firestore
    const flowerRef = doc(db, "items", flowerId);
    if (imageUrl) {
      flowerData.image = imageUrl; // Update the image URL if it was uploaded
    }
    await updateDoc(flowerRef, { ...flowerData });
    console.log("Flower updated with ID:", flowerId);
  } catch (error) {
    console.error("Error updating flower: ", error);
    throw error;
  }
};


const updateOrderStatus = async (orderId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.error("No user authenticated.");
    return;
  }
  const shopOwnerId = user.uid;

  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.error("No such document!");
      return;
    }

    const orderData = orderSnap.data();
    const currentStatus = orderData.orderStatus;
    if (currentStatus === "paid") { // Assuming inventory update happens when moving from "paid" to "prepared"

      // Load the shop owner's inventory
      const flowersQuery = query(collection(db, "items"), where(documentId(), "in", orderData.flowers.map(f => f.id)));
      const flowersSnap = await getDocs(flowersQuery);

      // Update stock for each flower in the order
      for (const item of orderData.flowers) {
        const flowerSnap = flowersSnap.docs.find(doc => doc.id === item.id);
        if (flowerSnap) {
          const flowerData = flowerSnap.data();
          const newStock = flowerData.stock - item.quantity;
          if (newStock < 0) {
            throw new Error(`Not enough stock for flower ${item.id}.`);
          }
          // Update the flower's stock using editFlower function
          await editFlower(shopOwnerId, item.id, { stock: newStock }, null); // Assuming null for `file` as we're not updating the image
        } else {
          throw new Error(`Flower with ID ${item.id} not found in inventory.`);
        }
      }
    }

    let newStatus = "";
    switch (currentStatus) {
      case "paid":
        newStatus = "prepared";
        break;
      case "prepared":
        newStatus = "delivered";
        break;
      default:
        console.error("Order is in an unhandled status:", currentStatus);
        return;
    }

    // Finally, update the order status
    await updateDoc(orderRef, { orderStatus: newStatus });
    console.log(`Order status updated to "${newStatus}" with ID: `, orderId);

  } catch (error) {
    console.error("Error updating order status and inventory: ", error);
    throw error; // Rethrow or handle as needed
  }
};

 
const giveCoupon = async (orderId, couponValue) => {
  try {
    // Load the order document using the order ID
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.log("No such order!");
      return;
    }

    // Extract the customerId and storeOwnerId from the order document
    const orderData = orderSnap.data();
    const customerId = orderData.customerId;
    const storeOwnerId = orderData.storeOwnerId;

    // Ensure customerId and storeOwnerId exist
    if (!customerId || !storeOwnerId) {
      console.error("Order missing customerId or storeOwnerId");
      return;
    }

    // Create a new document in the "coupons" collection with customerId, storeOwnerId, and couponValue
    const couponsCollectionRef = collection(db, "coupons");
    await addDoc(couponsCollectionRef, {
      customerId,
      storeOwnerId,
      value: couponValue, // Assuming you want to name the field "value" for the coupon value
      isUsed: false
    });

    console.log("Coupon successfully added for customerId:", customerId);
  } catch (error) {
    console.error("Error giving coupon: ", error);
    throw error;
  }
};
  /**
   * Deletes a flower from the Firestore database and removes it from the shop owner's inventory.
   * @param {string} shopOwnerId - The ID of the shop owner.
   * @param {string} flowerId - The ID of the flower to delete.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const deleteFlower = async (shopOwnerId, flowerId) => {
    try {
      // Delete the flower from the "flowers" collection
      const flowerRef = doc(db, "items", flowerId);
      await deleteDoc(flowerRef);
      console.log("Flower deleted with ID:", flowerId);
  
      // Ensure the shop owner's inventory array exists and is an array
      const shopOwnerRef = doc(db, "ShopOwners", shopOwnerId);
      const shopOwnerDoc = await getDoc(shopOwnerRef);
  
      if (shopOwnerDoc.exists()) {
        const shopOwnerData = shopOwnerDoc.data();
        // Check if inventory exists and is an array
        if (Array.isArray(shopOwnerData.inventory)) {
          await updateDoc(shopOwnerRef, {
            inventory: arrayRemove(flowerId)
          });
          console.log("Flower removed from shop owner's inventory.");
        } else {
          console.log("Inventory does not exist or is not an array, skipping removal.");
        }
      } else {
        console.log("ShopOwner document does not exist.");
      }
    } catch (error) {
      console.error("Error deleting flower: ", error);
      throw error;
    }
  };
  
  /**
 * Creates a new shop owner in Firestore and uploads their store photo to Firebase Storage.
 * @param {Object} shopOwnerData - The data for the new shop owner.
 * @param {File} file - The store photo file.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
  */
 
const createShopOwner = async (shopOwnerData, file, uid) => {
  try {
    let imageUrl = '';

    // Upload the store photo to Firebase Storage
    if (file) {
      const imageRef = storageRef(storage, `shopOwners/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Create a reference to the specific document in the "ShopOwners" collection
    const shopOwnerDocRef = doc(db, "ShopOwners", uid);

    // Set the data for the new shop owner document with the specified UID
    await setDoc(shopOwnerDocRef, {
      ...shopOwnerData,
      storePhoto: imageUrl, // Include the image URL in the Firestore document
    });

    console.log("New shop owner added with ID:", uid);
  } catch (error) {
    console.error("Error creating shop owner: ", error);
    throw error;
  }
};

const updateShopOwnerData = async (updatedData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    const docRef = doc(db, "ShopOwners", user.uid);

    // Update the document with updatedData
    await updateDoc(docRef, updatedData);

    console.log("Shop owner data updated successfully");
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating shop owner data: ", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
  export { signInShopOwner,updateOrderStatus, addFlower, giveCoupon,fetchInventoryForShopOwner, fetchShopOwnerData, editFlower, deleteFlower,createShopOwner ,fetchOrdersWithFlowerDetails,
    updateShopOwnerData};