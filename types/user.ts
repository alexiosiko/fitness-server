export type Day = {
	date: Date,
	foods: Food[],
	exercises: Exercise[]
}
export type Food = {
	name: string,
	calories: number,
	protein: number
}
export type Exercise = {
	name: string,
	timeInMinutes: number,
	calories: number
}

export type Activity = {
	name: string,
	calories: number,
}
export type UserDataType = { 
	_id: string,
	userId: string,
	dailyCalorieTarget: number,
	days: Day[]
}
export type UserDataTypeWithout_id = Omit<UserDataType, '_id'>;
