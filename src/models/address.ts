import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/IAddress';

const AddressSchema = new Schema<IAddress>({
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    post_code: { type: String, required: true }
});

export const AddressModel = model<IAddress>('Address', AddressSchema);