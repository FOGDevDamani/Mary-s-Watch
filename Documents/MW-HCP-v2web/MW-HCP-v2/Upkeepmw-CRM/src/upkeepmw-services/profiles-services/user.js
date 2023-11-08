class User {
	constructor({profileImage, agreedToTOC, userPerspective, textOrEmail, companyType, accountType, bio, phone, licenseNumber, firstName, lastName, address, city, state, zipcode, county, username, email, password,
		createdOn}) {
			this.profileImage = profileImage,
			this.agreedToTOC = agreedToTOC,
			this.userPerspective = userPerspective,
			this.textOrEmail = textOrEmail,
			this.companyType = companyType,
			this.accountType = accountType,
			this.bio = bio,
			this.phone = phone,
			this.licenseNumber = licenseNumber,
			this.firstName = firstName,
			this.lastName = lastName,
			this.address = address,
			this.city = city,
			this.state = state,
			this.zipcode = zipcode,
			this.county = county
			this.username = username,
			this.email = email,
			this.createdOn = createdOn
	}
	async signUp() {
			console.log('sign up was successful after this call was made')
	}


}

export { User }