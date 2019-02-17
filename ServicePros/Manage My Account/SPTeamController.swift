//
//  SPTeamController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class SPTeamController: UIViewController, UITextFieldDelegate {
  
  @IBOutlet weak var spTeamAssignAs: UITextField!
  @IBOutlet weak var spTeamFirstName: UITextField!
  @IBOutlet weak var spTeamLastName: UITextField!
  @IBOutlet weak var spTeamEmail: UITextField!
  @IBOutlet weak var spTeamAddress: UITextField!
  @IBOutlet weak var spTeamState: UITextField!
  @IBOutlet weak var spTeamCity: UITextField!
  @IBOutlet weak var spTeamZipcode: UITextField!
  @IBOutlet weak var spTeamCellphone: UITextField!
  
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
  @IBAction func addSPTeamMember(_ sender: Any) {
    
    guard let assignAs = spTeamAssignAs.text, spTeamAssignAs.text?.count != 0 else {
      let enterProperRole = UIAlertController(title: "FIeld left empty", message: "Please enter valid role", preferredStyle: .alert)
      enterProperRole.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterProperRole, animated: true, completion: nil)
      return}
    
    guard let firstName = spTeamFirstName.text, spTeamFirstName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a first name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let lastName = spTeamLastName.text, spTeamLastName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid last name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let  email = spTeamEmail.text, spTeamEmail.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Plase enter a valid meail", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let address = spTeamAddress.text, spTeamAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid email", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let state = spTeamState.text, spTeamState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid state", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let city = spTeamCity.text, spTeamCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid city", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let zipCode = spTeamZipcode.text, spTeamZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid zipcode", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let cellPhone = spTeamCellphone.text, spTeamCellphone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "please enter a valid cell phone number", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newSPTeam = SPTeam(assignRole: assignAs, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zipCode)
    
    let spTeamReference = Firestore.firestore().collection("User").document("Service Provider").collection("MyTeam")
    
    spTeamReference.addDocument(data: newSPTeam.dictionary) { (error) in
      if let error = error {
        print("Error creating customer: \(error.localizedDescription)")
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

extension SPTeamController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spTeamAssignAs {
      spTeamFirstName.becomeFirstResponder()
    } else if textField == spTeamFirstName {
      spTeamLastName.becomeFirstResponder()
    } else if textField == spTeamLastName {
      spTeamEmail.becomeFirstResponder()
    } else if textField == spTeamEmail {
      spTeamAddress.becomeFirstResponder()
    } else if textField == spTeamAddress {
      spTeamState.becomeFirstResponder()
    } else if textField == spTeamState {
      spTeamCity.becomeFirstResponder()
    } else if textField == spTeamCity {
      spTeamZipcode.becomeFirstResponder()
    } else if textField == spTeamZipcode {
      spTeamCellphone.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
  
}
