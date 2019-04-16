//
//  RenterProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class RenterProfileController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  
  var renterReference: DocumentReference!
  var namesArray = [Renter]()
  
  @IBOutlet weak var renterProfileView: UITableView!
  @IBOutlet weak var renterProfileImage: UIImageView!
  @IBOutlet weak var changeRenterProfileImage: UIButton!
  
  var imagePicker: UIImagePickerController!
  
  override func viewDidLoad() {
        super.viewDidLoad()
        renterReference = Firestore.firestore().collection("User").document("Renter")
        loadData()
    let imageTap = UITapGestureRecognizer(target: self, action: #selector(openImagePicker))
    renterProfileImage.isUserInteractionEnabled = true
    renterProfileImage.addGestureRecognizer(imageTap)
    changeRenterProfileImage.addTarget(self, action: #selector(openImagePicker), for: .touchUpInside)
    
    imagePicker = UIImagePickerController()
    imagePicker.allowsEditing = true
    imagePicker.sourceType = .photoLibrary
    imagePicker.delegate = self
  }
  
  @objc func openImagePicker(sender: Any) {
    self.present(imagePicker, animated: true, completion: nil)
  }
  
  func loadData() {
    renterReference.getDocument { (document, error) in
      if let renter = document.flatMap({ $0.data().flatMap({ (data) in
          return Renter(dictionary: data)
        })
      }) {
        self.namesArray.append(renter)
        DispatchQueue.main.async {
          self.renterProfileView.reloadData()
        }
      } else {
        print("error retrieving renter: \(String(describing: error?.localizedDescription))")
      }
    }
  }
  
  @IBAction func signOutRenterProfile(_ sender: Any) {
    do{
      try Auth.auth().signOut()
      let storyBoard = UIStoryboard(name: "Main", bundle: nil)
      let goToLogin = storyBoard.instantiateViewController(withIdentifier: "RenterLoginController")
      self.present(goToLogin, animated: true, completion: nil)
    } catch {
      print("Error signing out: \(error.localizedDescription)")
    }
  }
  
   
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return namesArray.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let identifier = "RenterProfileCell"
    let cell = tableView.dequeueReusableCell(withIdentifier: identifier, for: indexPath) as! RenterProfileCell
    
    let renter = namesArray[indexPath.row]
    
	cell.renterProfileLabel.text = "Welcome \(renter.username)"
    
    return cell
  }
  
}

extension RenterProfileController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
  
  func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
    picker.dismiss(animated: true, completion: nil)
  }
  
  func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
    
    if let pickedImage = info[UIImagePickerController.InfoKey.editedImage] as? UIImage {
      self.renterProfileImage.image = pickedImage
    }
    
    picker.dismiss(animated: true, completion: nil)
  }
  
  
  
}



