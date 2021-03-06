import {Request, Response} from 'express';
import {Invoice, Paid} from "./interfaces";
import dotevn from "dotenv";

dotevn.config()
const charge = require('lightning-charge-client')
(process.env.CHARGE_HOST, process.env.CHARGE_API_KEY);

export const redirectPayment = async (req: Request, res: Response) => {
	const {invoice} = req.query;
	res.redirect(`http://charge.tiger.hackbtc19.offchain.rocks/checkout/${invoice}`)
};

export const getInvoice = async (req: Request, res: Response) => {
	const amount = req.query.amount || 50;
	const invoice: Invoice = await charge.invoice({msatoshi: amount});
	res.jsend.success({invoice});
};

export const isPayed = async (req: Request, res: Response) => {
	const {invoice} = req.query;
	let result;
	try {
		const paidRes: Paid = await charge.fetch(invoice)
		result = {
			paid: paidRes.status === "paid",
			invoice,
			meta: paidRes
		}
	} catch (e) {
		console.log(e);
		result = {
			paid: false,
			invoice
		}

	}

	res.jsend.success(result)
};
