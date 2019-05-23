//
//  OwnerSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 9/6/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseFirestore

class SignUpController: UIViewController, UITextFieldDelegate
{
    @IBOutlet weak var ownerScrollView: UIScrollView!
	
	@IBOutlet var typeOfOwnerTextField: UITextField!
	@IBOutlet var ownerFirstNameTextField: UITextField!
	@IBOutlet var ownerlasttNameTextField: UITextField!
	@IBOutlet var ownerEmailTextField: UITextField!
	@IBOutlet var ownerCellPhoneTextField: UITextField!
	@IBOutlet var ownerStateTextField: UITextField!
	@IBOutlet var ownerCityTextField: UITextField!
	@IBOutlet var ownerZipcodeTextField: UITextField!
	@IBOutlet var ownerCountyTextField: UITextField!
	@IBOutlet var ownerUsernameTextField: UITextField!
	@IBOutlet var ownerPasswordTextField: UITextField!
	@IBOutlet var ownerConfirmPasswordTextField: UITextField!
	@IBOutlet var ownerAddressTextField: UITextField!
	
  var selectedState: String?
  
 let states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
  
    
    override func viewDidLoad()
	{
        super.viewDidLoad()
	
        configureTapGesture()
        createToolBar()
        createStatePicker()
		
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)),
											   name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)),
											   name: UIResponder.keyboardWillHideNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)),
											   name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }
  
  deinit
  {
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
  }
  
  func createStatePicker()
  {
    let statePicker = UIPickerView()
    statePicker.delegate = self
    
    ownerStateTextField.inputView = statePicker
  }
  
  func createToolBar()
  {
    let toolBar = UIToolbar()
    toolBar.sizeToFit()
    
    let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self,
									 action: #selector(OwnerSignUpController.handleTap))
    
    toolBar.setItems([doneButton], animated: false)
    toolBar.isUserInteractionEnabled = true
    
    ownerStateTextField.inputAccessoryView = toolBar
  }
  
  private func configureTapGesture()
  {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(OwnerSignUpController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap()
  {
    view.endEditing(true)
  }
  
  @objc func keyboardWillChange(notification: Notification)
  {
    guard let keyboardRect = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else
	{
      return
    }
    
    let keyboardViewEndFrame = view.convert(keyboardRect, to: view.window)
    
    if notification.name == UIResponder.keyboardWillShowNotification || notification.name == UIResponder
      .keyboardWillChangeFrameNotification {
      ownerScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else
	{
      ownerScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
	
  

    @IBAction func signUp(_ sender: Any)
	{
        guard let email = ownerEmailTextField.text, ownerEmailTextField.text?.count != 0, isValidEmail(emailID: email) != false  else
		{
			let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
          	enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          	self.present(enterValidEmailAlert, animated: true, completion: nil)
          	return
		}
        guard let password = ownerPasswordTextField.text, ownerPasswordTextField.text?.count != 0, isPasswordValid(password: password) != false else
		{
			let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
          	enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          	self.present(enterValidPasswordAlert, animated: true, completion: nil)
          	return
		}
        guard let username = ownerUsernameTextField.text, ownerUsernameTextField.text?.count != 0  else
		{
			let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
          	enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          	self.present(enterValidUsernameAlert, animated: true, completion: nil)
          	return
		}
        guard let typeOfOwner = typeOfOwnerTextField.text, typeOfOwnerTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
          	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let firstName = ownerFirstNameTextField.text, ownerFirstNameTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let lastName = ownerlasttNameTextField.text, ownerlasttNameTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let cellPhone = ownerCellPhoneTextField.text, ownerCellPhoneTextField.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let address = ownerAddressTextField.text, ownerAddressTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let state = ownerStateTextField.text, ownerStateTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let city = ownerCityTextField.text, ownerCityTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let zip = ownerZipcodeTextField.text, ownerZipcodeTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        	fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      guard let county = ownerCountyTextField.text, ownerCountyTextField.text?.count != 0 else
		{
			let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
			fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        	self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          	return
		}
      
      
        if ownerConfirmPasswordTextField.text == ownerPasswordTextField.text
		{
          
			
          
         showAlert(title: "Congratulations! Your account has been setup." , message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", style: .alert, handler: proceedToOwnerLogin)
        } else
		{
           showAlert(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", style: .alert, handler: emptyFields)
        }
  
    }
  
  
  @IBAction func dismissSignupVIew(_ sender: Any)
  {
    self.dismiss(animated: true, completion: nil)
  }
  
  
}

extension OwnerSignUpController: UIPickerViewDataSource, UIPickerViewDelegate
{
  
	func textFieldShouldReturn(_ textField: UITextField) -> Bool
	{
		if textField == typeOfOwnerTextField
		{
			ownerFirstNameTextField.becomeFirstResponder()
		} else if textField == ownerFirstNameTextField
		{
			ownerlasttNameTextField.becomeFirstResponder()
		} else if textField == ownerlasttNameTextField
		{
			ownerEmailTextField.becomeFirstResponder()
		} else if textField == ownerEmailTextField
		{
			ownerCellPhoneTextField.becomeFirstResponder()
		} else if textField == ownerCellPhoneTextField
		{
			ownerAddressTextField.becomeFirstResponder()
		} else if textField == ownerAddressTextField
		{
			ownerStateTextField.becomeFirstResponder()
		} else if textField == ownerStateTextField
		{
			ownerCityTextField.becomeFirstResponder()
		} else if textField == ownerCityTextField
		{
			ownerZipcodeTextField.becomeFirstResponder()
		} else if textField == ownerZipcodeTextField
		{
			ownerCountyTextField.becomeFirstResponder()
		} else if textField == ownerCountyTextField
		{
			ownerUsernameTextField.becomeFirstResponder()
		} else if textField == ownerUsernameTextField
		{
			ownerPasswordTextField.becomeFirstResponder()
		} else if textField == ownerPasswordTextField
		{
			ownerConfirmPasswordTextField.becomeFirstResponder()
		} else
		{
			textField.resignFirstResponder()
		}
		return true
	}
  
  func isValidEmail(emailID: String) -> Bool
  {
    let emailRegEx = "[A-z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    let emailTest = NSPredicate(format: "SELF MATCHES %@", emailRegEx)
    return emailTest.evaluate(with: emailID)
  }
  
  func isPasswordValid(password: String) -> Bool
  {
    let passwordRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
    let passwordTest = NSPredicate(format: "SELF MATCHES %@", passwordRegEx)
    return passwordTest.evaluate(with: password)
  }
  
  func isPhoneNumberValid(cellPhone: String) -> Bool
  {
    let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
    let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
    return cellPhoneTest.evaluate(with:cellPhone)
  }
  
  func numberOfComponents(in pickerView: UIPickerView) -> Int
  {
    return 1
  }
  
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int
  {
    return states.count
  }
  
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String?
  {
    return states[row]
  }
  
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int)
  {
    selectedState = states[row]
   ownerStateTextField.text = selectedState
  }
  
  func showAlert(title: String, message: String, style: UIAlertController.Style = .alert, handler: ((UIAlertAction) -> Void)?)
  {
    let alertController = UIAlertController(title: title, message: message, preferredStyle: style)
    let okAction = UIAlertAction(title: "OK", style: .default, handler: handler)
    alertController.addAction(okAction)
    
    present(alertController, animated: true, completion: nil)
  }
  
  func proceedToOwnerLogin(sender: UIAlertAction) -> Void
  {
    let storyBoard = UIStoryboard(name: "Main", bundle: nil)
    let popUp = storyBoard.instantiateViewController(withIdentifier: "OwnerLoginController")
    self.present(popUp, animated: true, completion: nil)
  }
  
  func emptyFields(sender: UIAlertAction) -> Void
  {
    self.ownerPasswordTextField.text = ""
    self.ownerConfirmPasswordTextField.text = ""
  }
  
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


