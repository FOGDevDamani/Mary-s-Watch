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
    
    @IBOutlet weak var typeOfOwnerTF: UITextField!
    @IBOutlet weak var firstNameTF: UITextField!
    @IBOutlet weak var lastNameTF: UITextField!
    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var cellPhoneTF: UITextField!
    @IBOutlet weak var addressTF: UITextField!
    @IBOutlet weak var stateTF: UITextField!
    @IBOutlet weak var cityTF: UITextField!
    @IBOutlet weak var zipCodeTF: UITextField!
    @IBOutlet weak var countyTF: UITextField!
    @IBOutlet weak var userNameTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    
    var reference: CollectionReference!

    override func viewDidLoad() {
        super.viewDidLoad()
        reference = Firestore.firestore().collection("User")
    }
    
    
    @IBAction func saveSettings(_ sender: Any) {
        guard let firstName = firstNameTF.text, !firstName.isEmpty else {return}
        guard let lastName = lastNameTF.text, !lastName.isEmpty else {return}
        guard let email = emailTF.text, !email.isEmpty else {return}
        guard let cellPhone = cellPhoneTF.text, !cellPhone.isEmpty else {return}
        guard let address = addressTF.text, !address.isEmpty else {return}
        guard let state = stateTF.text, !state.isEmpty else {return}
        guard let city = cityTF.text, !city.isEmpty else {return}
        guard let zipCode = zipCodeTF.text, !zipCode.isEmpty else {return}
        guard let county = countyTF.text, !county.isEmpty else {return}
        
        let newProfile = User(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, city: city, state: state, county: county)
        
        reference.document("qYddEMg9j2PxaxKocb3D").setData(newProfile.dicitonary)
        
        dismissViewController()
    }
    
    func dismissViewController() {
        self.dismiss(animated: true, completion: nil)
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == firstNameTF {
            lastNameTF.becomeFirstResponder()
        } else if textField == lastNameTF {
            emailTF.becomeFirstResponder()
        } else if textField == emailTF {
            cellPhoneTF.becomeFirstResponder()
        } else if textField == cellPhoneTF {
            addressTF.becomeFirstResponder()
        } else if textField == addressTF {
            stateTF.becomeFirstResponder()
        } else if textField == stateTF {
            cityTF.becomeFirstResponder()
        } else if textField == cityTF {
            zipCodeTF.becomeFirstResponder()
        } else if textField == zipCodeTF {
            countyTF.becomeFirstResponder()
        } else {
            textField.resignFirstResponder()
        }
        
        return true
    }
    
   

}























