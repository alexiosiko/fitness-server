export type activity = {
	name: string,
	calories: number,
}
export type Day = {
	date: Date,
	activities: activity[]
}
export type UserDataType = { 
	_id: string,
	userId: string,
	dailyCalorieTarget: number,
	days: Day[]
}

export type UserDataTypeWithout_id = Omit<UserDataType, '_id'>;
