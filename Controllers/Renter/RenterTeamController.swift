//
//  RenterTeamController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class RenterTeamController: UIViewController, UITextFieldDelegate {

  
  @IBOutlet weak var renterAssignRole: UITextField!
  @IBOutlet weak var renterTeamFirstName: UITextField!
  @IBOutlet weak var renterTeamLastName: UITextField!
  @IBOutlet weak var renterTeamEmail: UITextField!
  @IBOutlet weak var renterTeamAddress: UITextField!
  @IBOutlet weak var renterTeamState: UITextField!
  @IBOutlet weak var renterTeamCity: UITextField!
  @IBOutlet weak var renterTeamZip: UITextField!
  @IBOutlet weak var renterTeamCellphone: UITextField!
  
  var docRef: DocumentReference!
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    confirgureTapGesture()
    configureTextFields()
    
    
    
    }
  func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(RenterTeamController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    renterAssignRole.delegate = self
    renterTeamFirstName.delegate = self
    renterTeamLastName.delegate = self
    renterTeamEmail.delegate = self
    renterTeamAddress.delegate = self
    renterTeamState.delegate = self
    renterTeamCity.delegate = self
    renterTeamZip.delegate = self
    renterTeamCellphone.delegate = self
  }
  
  @IBAction func dismissRenterTeam(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
    
  @IBAction func renterAddTeamMember(_ sender: Any) {
    guard let assignRole = renterAssignRole.text, renterAssignRole.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid role", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let firstName = renterTeamFirstName.text, renterTeamFirstName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a first name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let lastName = renterTeamLastName.text, renterTeamLastName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid last name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let email = renterTeamEmail.text, renterTeamEmail.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Plase enter a valid meail", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let address = renterTeamAddress.text, renterTeamAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid email", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let state = renterTeamState.text, renterTeamState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid state", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let city = renterTeamCity.text, renterTeamCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid city", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let zipCode = renterTeamZip.text, renterTeamZip.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid zipcode", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let cellPhone = renterTeamCellphone.text, renterTeamCellphone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "please enter a valid cell phone number", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    
    let newRenterTeam = RenterTeam(assignRole: assignRole, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zipCode)
    
    Firestore.firestore().collection("User").document("Renter").collection("MyTeam").addDocument(data: newRenterTeam.dictionary) { (error) in
      if let error = error {
        print("Unable to create user: \(error.localizedDescription)")
      } else {
        print("User created")
      }
    }
      
    let teamMemberCreatedAlert = UIAlertController(title: "Team Member Invited", message: "Invitation to join your team has been sent", preferredStyle: .alert)
    teamMemberCreatedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
      self.dismiss(animated: true, completion: nil)
    }))
    self.present(teamMemberCreatedAlert, animated: true, completion: nil)
  }
    
  
  
  
  
  
  
  
  
}

extension RenterTeamController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == renterAssignRole {
      renterTeamFirstName.becomeFirstResponder()
    } else if textField == renterTeamFirstName {
      renterTeamLastName.becomeFirstResponder()
    } else if textField == renterTeamLastName {
      renterTeamEmail.becomeFirstResponder()
    } else if textField == renterTeamEmail {
      renterTeamAddress.becomeFirstResponder()
    } else if textField == renterTeamAddress {
      renterTeamState.becomeFirstResponder()
    } else if textField == renterTeamState {
      renterTeamCity.becomeFirstResponder()
    } else if textField == renterTeamCity {
      renterTeamZip.becomeFirstResponder()
    } else if textField == renterTeamZip {
      renterTeamCellphone.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
  
  func isValidEmail(emailID: String) -> Bool {
    let emailRegEx = "[A-z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    let emailTest = NSPredicate(format: "SELF MATCHES %@", emailRegEx)
    return emailTest.evaluate(with: emailID)
  }
  
  func isPhoneNumberValid(cellPhone: String) -> Bool {
    let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
    let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
    return cellPhoneTest.evaluate(with:cellPhone)
  }
  
}
