import faker from "faker";

export const Helper = {
	GetServiceNameFromAccount: (account) => {
		switch(account){
			case ACCOUNTS.ca_parcel:	return "Dicom Parcel Canada";
			case ACCOUNTS.ca_freight:	return "Dicom LTL Canada";
			case ACCOUNTS.us_parcel:	return "Dicom Parcel - US";
			default: 					return null;
		}
	}
};
export const PAYMENT_TYPES = {
	prepaid: "PREPAID",
	collect: "COLLECT",
	third_party: "THIRD_PARTY",
	array: ["PREPAID","COLLECT","THIRD_PARTY"]
};
export const ACCOUNTS = {
	ca_parcel: "300030",
	us_parcel: "41562",
	ca_freight: "8292093",
	array: ["300030","41562","8292093"]
};
export const SERVICE_TYPES = {
	air: "AIR",
	ground: "GRD",
	array: 	["AIR","GRD"]
};
export const PICKUP_POINTS = {
	office: "BU",
	ground_floor: "RC",
	mail_room: "MR",
	other: "OT",
	home: "PH",
	basement: "SS",
	mailbox: "MB",
	array: ["BU","RC","MR","OT","PH","SS","MB"]
};
export const PICKUP_TIMES = {
	seven_thirty: "7:30",
	eight: "8:00",
	eight_thirty: "8:30",
	nine: "9:00",
	nine_thirty: "9:30",
	ten: "10:00",
	ten_thirty: "10:30",
	eleven: "11:00",
	eleven_thirty: "11:30",
	twelve: "12:00",
	twelve_thirty: "12:30",
	one: "13:00",
	one_thirty: "13:30",
	two: "14:00",
	two_thirty: "14:30",
	three: "15:00",
	three_thirty: "15:30",
	four: "16:00",
	four_thirty: "16:30",
	five: "17:00",
	five_thirty: "17:30",
	six: "18:00",
	six_thirty: "18:30",
	seven: "19:00",
	array: ["7:30","8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00",]
}
export const MEASUREMENTS = {
	metric: "metric",
	imperial: "imperial",
	array: ["metric", "imperial"]
};
export const PARCEL_PACKAGES = {
	envelope: "EV",
	box: "BX",
	array: ["EV", "BX"],
}
export const FREIGHT_PACKAGES = {
	tube: "tube",
	other: "other",
	barrel: "baril",
	skid: "skid",
	box: "box",
	crate: "crate",
	full_load: "full",
	bundle: "bundle",
	piece: "piece",
	pallet: "pallet",
	array: ["tube","other","baril","skid","box","crate","full","bundle","piece","pallet"],
}
export const PURPOSES = {
	commercial: "COM",
	personal: "PER",
	documents: "DOC",
	repair_return: "RET",
	array: ["COM","PER","DOC","RET"],
}
export const DUTY_OPTIONS = {
	shipper: "SHIPPER",
	recipient: "RECIPIENT",
	third_party: "THIRD_PARTY",
	array: ["SHIPPER","RECIPIENT","THIRD_PARTY"],
}