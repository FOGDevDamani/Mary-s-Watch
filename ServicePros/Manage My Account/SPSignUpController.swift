//
//  SPSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/8/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseFirestore

class SPSignUpController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var spCreateAccountTypeOfCompany: UITextField!
  @IBOutlet weak var spCreateAccountFirstName: UITextField!
  @IBOutlet weak var spCreateAccountLastName: UITextField!
  @IBOutlet weak var spCreateAccountEmail: UITextField!
  @IBOutlet weak var spCreateAccountCellPhone: UITextField!
  @IBOutlet weak var spCreateAccountAddress: UITextField!
  @IBOutlet weak var spCreateAccountState: UITextField!
  @IBOutlet weak var spCreateAccountCity: UITextField!
  @IBOutlet weak var spCreateAccountZip: UITextField!
  @IBOutlet weak var spCreateAccountCounty: UITextField!
  @IBOutlet weak var spCreateAccountUsername: UITextField!
  @IBOutlet weak var spCreateAccountPassword: UITextField!
  @IBOutlet weak var spCreateAccountConfirmPassword: UITextField!
  
  

  override func viewDidLoad() {
        super.viewDidLoad()
    
        configureTextFields()
        confirgureTapGesture()
    }
  
  private func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPSignUpController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  private func configureTextFields() {
    spCreateAccountTypeOfCompany.delegate = self
    spCreateAccountFirstName.delegate = self
    spCreateAccountLastName.delegate = self
    spCreateAccountEmail.delegate = self
    spCreateAccountCellPhone.delegate = self
    spCreateAccountAddress.delegate = self
    spCreateAccountState.delegate = self
    spCreateAccountCity.delegate = self
    spCreateAccountZip.delegate = self
    spCreateAccountCounty.delegate = self
    spCreateAccountUsername.delegate = self
    spCreateAccountPassword.delegate = self
    spCreateAccountConfirmPassword.delegate = self
  }
  
  
  @IBAction func signUpSP(_ sender: Any) {
    guard let typeOfCompany = spCreateAccountTypeOfCompany.text, spCreateAccountTypeOfCompany.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let email = spCreateAccountEmail.text, spCreateAccountEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    
    guard let password = spCreateAccountPassword.text, spCreateAccountPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    
    guard let username = spCreateAccountUsername.text, spCreateAccountUsername.text?.count != 0, isUsernameValid(username: username) != false  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    
    guard let firstName = spCreateAccountFirstName.text, spCreateAccountFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let lastName = spCreateAccountLastName.text, spCreateAccountLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let cellPhone = spCreateAccountCellPhone.text, spCreateAccountCellPhone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let address = spCreateAccountAddress.text, spCreateAccountAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let state = spCreateAccountState.text, spCreateAccountState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let city = spCreateAccountCity.text, spCreateAccountCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let zip = spCreateAccountZip.text, spCreateAccountZip.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let county = spCreateAccountCounty.text, spCreateAccountCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
    
    let newSP = ServiceProvider(typeOfCompany: typeOfCompany, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
    
    if spCreateAccountConfirmPassword.text == spCreateAccountPassword.text {
      
      Auth.auth().createUser(withEmail: email, password: password) { (result, error) in
        
        Firestore.firestore().collection("User").document("Service Provider").setData(newSP.dictionary, completion: { (error) in
          if let error = error {
            print("Unable to create user: \(error.localizedDescription)")
          } else {
            print("User created")
          }
        })
        
      }
      
      self.sendVerificationEmail()
      
      
      let creationSuccessAlert = UIAlertController(title: "Congratulations! Your account has been setup.", message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", preferredStyle: .alert )
      creationSuccessAlert.addAction(UIAlertAction(title: "Login", style: .default, handler: { (action) in
        let storyBoard = UIStoryboard(name: "Main", bundle: nil)
        let popUp = storyBoard.instantiateViewController(withIdentifier: "SPLoginController")
        self.present(popUp, animated: true, completion: nil)
      }))
      self.present(creationSuccessAlert, animated: true, completion: nil)
    } else {
      let passwordsDontMatchAlert = UIAlertController(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", preferredStyle: .alert)
      passwordsDontMatchAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.spCreateAccountPassword.text = ""
        self.spCreateAccountConfirmPassword.text = ""
      }))
      self.present(passwordsDontMatchAlert, animated: true, completion: nil)
    }
    
  }
  
  func sendVerificationEmail() {
    Auth.auth().currentUser?.sendEmailVerification(completion: { (error) in
      if error != nil {
        print("error sending email: \(String(describing: error?.localizedDescription))")
      } else {
        print("email verification sent")
      }
    })
  }
  
}

extension SPSignUpController {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spCreateAccountTypeOfCompany {
      spCreateAccountFirstName.becomeFirstResponder()
    } else if textField == spCreateAccountFirstName{
      spCreateAccountLastName.becomeFirstResponder()
    } else if textField == spCreateAccountLastName {
      spCreateAccountEmail.becomeFirstResponder()
    } else if textField == spCreateAccountEmail {
      spCreateAccountCellPhone.becomeFirstResponder()
    } else if textField == spCreateAccountCellPhone {
      spCreateAccountAddress.becomeFirstResponder()
    } else if textField == spCreateAccountAddress {
      spCreateAccountState.becomeFirstResponder()
    } else if textField == spCreateAccountState {
      spCreateAccountCity.becomeFirstResponder()
    } else if textField == spCreateAccountCity {
      spCreateAccountZip.becomeFirstResponder()
    } else if textField == spCreateAccountZip {
      spCreateAccountCounty.becomeFirstResponder()
    } else if textField == spCreateAccountCounty {
      spCreateAccountUsername.becomeFirstResponder()
    } else if textField == spCreateAccountUsername {
      spCreateAccountPassword.becomeFirstResponder()
    } else if textField == spCreateAccountPassword {
      spCreateAccountConfirmPassword.becomeFirstResponder()
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
  
  func isPasswordValid(password: String) -> Bool {
  let passwordRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
  let passwordTest = NSPredicate(format: "SELF MATCHES %@", passwordRegEx)
  return passwordTest.evaluate(with: password)
  }
  
  func isUsernameValid(username: String) -> Bool {
  let usernameRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
  let usernameTest = NSPredicate(format: "SELF MATCHES %@", usernameRegEx)
  return usernameTest.evaluate(with: username)
  }
  
  func isPhoneNumberValid(cellPhone: String) -> Bool {
  let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
  let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
  return cellPhoneTest.evaluate(with:cellPhone)
  }
  
}
