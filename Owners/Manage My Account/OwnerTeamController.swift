//
//  OwnerTeamController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class OwnerTeamController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var assignOwnerTeamMember: UITextField!
    @IBOutlet weak var ownerTeamMemberFirstName: UITextField!
    @IBOutlet weak var ownerTeamMemberLastName: UITextField!
    @IBOutlet weak var ownerTeamMemberEmail: UITextField!
    @IBOutlet weak var ownerTeamMemberAddress: UITextField!
    @IBOutlet weak var ownerTeamMemberState: UITextField!
    @IBOutlet weak var ownerTeamMemberCity: UITextField!
    @IBOutlet weak var ownerTeamMemberZipcode: UITextField!
    @IBOutlet weak var ownerTeamMemberCellPhone: UITextField!
    
    
    
   

    override func viewDidLoad() {
        super.viewDidLoad()
        
        

        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
      configureTapGesture()
      configureTextFields()
    }
  
  
  @IBAction func dismissTeamController(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(OwnerTeamController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    assignOwnerTeamMember.delegate = self
    ownerTeamMemberFirstName.delegate = self
    ownerTeamMemberLastName.delegate = self
    ownerTeamMemberEmail.delegate = self
    ownerTeamMemberAddress.delegate = self
    ownerTeamMemberState.delegate = self
    ownerTeamMemberCity.delegate = self
    ownerTeamMemberZipcode.delegate = self
    ownerTeamMemberCellPhone.delegate = self
  }
    
    
    
    @IBAction func addOwnerTeamMember(_ sender: Any) {
      guard let assignAs = assignOwnerTeamMember.text, assignOwnerTeamMember.text?.count != 0 else {
        let enterProperRole = UIAlertController(title: "FIeld left empty", message: "Please enter valid role", preferredStyle: .alert)
        enterProperRole.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(enterProperRole, animated: true, completion: nil)
        return}
      
      guard let firstName = ownerTeamMemberFirstName.text, ownerTeamMemberFirstName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a first name", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let lastName = ownerTeamMemberLastName.text, ownerTeamMemberLastName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid last name", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let  email = ownerTeamMemberEmail.text, ownerTeamMemberEmail.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Plase enter a valid meail", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let address = ownerTeamMemberAddress.text, ownerTeamMemberAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid email", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let state = ownerTeamMemberState.text, ownerTeamMemberState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid state", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let city = ownerTeamMemberCity.text, ownerTeamMemberCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid city", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let zipCode = ownerTeamMemberZipcode.text, ownerTeamMemberZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid zipcode", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let cellPhone = ownerTeamMemberCellPhone.text, ownerTeamMemberCellPhone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "please enter a valid cell phone number", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      let newOwnerTeam = OwnerTeam(assignRole: assignAs, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zipCode)
      
      let ownerTeamReference = Firestore.firestore().collection("User").document("Owner").collection("MyTeam")
      
      ownerTeamReference.addDocument(data: newOwnerTeam.dictionary) { (error) in
        if let error = error {
          print("Error creating team: \(error.localizedDescription)")
        } else {
          print("Team Successfully created")
        }
      }
      
      let teamMemberCreatedAlert = UIAlertController(title: "Team Member Invited", message: "Invitation to join your team has been sent", preferredStyle: .alert)
      teamMemberCreatedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.dismiss(animated: true, completion: nil)
      }))
      self.present(teamMemberCreatedAlert, animated: true, completion: nil)

      
    }

 

}

extension OwnerTeamController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == assignOwnerTeamMember {
      ownerTeamMemberFirstName.becomeFirstResponder()
    } else if textField == ownerTeamMemberFirstName {
      ownerTeamMemberLastName.becomeFirstResponder()
    } else if textField == ownerTeamMemberLastName {
      ownerTeamMemberEmail.becomeFirstResponder()
    } else if textField == ownerTeamMemberEmail {
      ownerTeamMemberAddress.becomeFirstResponder()
    } else if textField == ownerTeamMemberAddress {
      ownerTeamMemberState.becomeFirstResponder()
    } else if textField == ownerTeamMemberState {
      ownerTeamMemberCity.becomeFirstResponder()
    } else if textField == ownerTeamMemberCity {
      ownerTeamMemberZipcode.becomeFirstResponder()
    } else if textField == ownerTeamMemberZipcode {
      ownerTeamMemberCellPhone.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
}
