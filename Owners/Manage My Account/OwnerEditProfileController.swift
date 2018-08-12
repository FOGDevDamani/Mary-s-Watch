//
//  OwnerEditProfileController.swift
//  maryswatch
//
//  Created by Damani Turner on 5/24/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseFirestore



class OwnerEditProfileController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var typeOfOwner: UITextField!
    @IBOutlet weak var firstName: UITextField!
    @IBOutlet weak var lastName: UITextField!
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var cellPhone: UITextField!
    @IBOutlet weak var address: UITextField!
    @IBOutlet weak var state: UITextField!
    @IBOutlet weak var city: UITextField!
    @IBOutlet weak var zipCode: UITextField!
    @IBOutlet weak var county: UITextField!
    @IBOutlet weak var userName: UITextField!
    @IBOutlet weak var password: UITextField!
    
    var reference: CollectionReference!

    override func viewDidLoad() {
        super.viewDidLoad()
        reference = Firestore.firestore().collection("User")
    }
    
    
    @IBAction func submitSettings(_ sender: Any) {
        guard let firstName = firstName.text, !firstName.isEmpty else {return}
        guard let lastName = lastName.text, !lastName.isEmpty else {return}
        guard let email = email.text, !email.isEmpty else {return}
        guard let cellPhone = cellPhone.text, !cellPhone.isEmpty else {return}
        guard let address = address.text, !address.isEmpty else {return}
        guard let state = state.text, !state.isEmpty else {return}
        guard let city = city.text, !city.isEmpty else {return}
        guard let zipCode = zipCode.text, !zipCode.isEmpty else {return}
        guard let county = county.text, !county.isEmpty else {return}
        
        let newProfile = User(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, city: city, state: state, county: county)
        
        reference.document("qYddEMg9j2PxaxKocb3D").setData(newProfile.dicitonary)
        
        dismissViewController()
    }
    
    func dismissViewController() {
        self.dismiss(animated: true, completion: nil)
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == firstName {
            lastName.becomeFirstResponder()
        } else if textField == lastName {
            email.becomeFirstResponder()
        } else if textField == email {
            cellPhone.becomeFirstResponder()
        } else if textField == cellPhone {
            address.becomeFirstResponder()
        } else if textField == address {
            state.becomeFirstResponder()
        } else if textField == state {
            city.becomeFirstResponder()
        } else if textField == city {
            zipCode.becomeFirstResponder()
        } else if textField == zipCode {
            county.becomeFirstResponder()
        } else {
            textField.resignFirstResponder()
        }
        
        return true
    }
    
   
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}























