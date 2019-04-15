//
//  User.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/5/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import Foundation

protocol DocumentSerializable {
    init?(dictionary: [String: Any])
}

struct User {
    let firstName: String
    let lastName: String
    let email: String
    let cellPhone: String
    let address: String
    let city: String
    let state: String
    let county: String
    
    var dicitonary: [String: Any] {
        return [
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "cellPhone": cellPhone,
            "address": address,
            "city": city,
            "state": state,
            "county": county
        ]
    }

}

extension User: DocumentSerializable {
    init?(dictionary: [String : Any]) {
       guard let firstName = dictionary["firstName"] as? String,
        let lastName = dictionary["lastName"] as? String,
        let email = dictionary["email"] as? String,
        let cellPhone = dictionary["cellPhone"] as? String,
        let address = dictionary["address"] as? String,
        let city = dictionary["city"] as? String,
        let state = dictionary["state"] as? String,
        let county = dictionary["county"] as? String else { return nil }
        
        self.init(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, city: city, state: state, county: county)
    }
}
