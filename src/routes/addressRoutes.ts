import { Router } from "express";
import {
  createAddress,
  getAddressById,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const router = Router();

router.post("/addresses", createAddress);
router.get("/addresses", getAllAddresses);
router.get("/addresses/:id", getAddressById);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

export default router;
