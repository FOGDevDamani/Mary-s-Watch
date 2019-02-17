//
//  SPProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPProfileController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  
  var spReference: DocumentReference!
  var spNameArray = [ServiceProvider]()
  
  @IBOutlet weak var spProfileView: UITableView!
  

    override func viewDidLoad() {
        super.viewDidLoad()

        spReference = Firestore.firestore().collection("User").document("Service Provider")
        loadData()
    }
  
  
  @IBAction func signOutSPProfile(_ sender: Any) {
    do{
      try Auth.auth().signOut()
      let storyBoard = UIStoryboard(name: "Main", bundle: nil)
      let goToLogin = storyBoard.instantiateViewController(withIdentifier: "LoginController")
      self.present(goToLogin, animated: true, completion: nil)
    } catch {
      print("Error signing out: \(error.localizedDescription)")
    }
  }
  
  func loadData() {
    spReference.getDocument { (document, error) in
      if let sp = document.flatMap({ $0.data().flatMap({ (data) in
        return ServiceProvider(dictionary: data)
      })
      }) {
        self.spNameArray.append(sp)
        DispatchQueue.main.async {
          self.spProfileView.reloadData()
        }
      } else {
        print("error retrieving renter: \(String(describing: error?.localizedDescription))")
      }
    }
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return spNameArray.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let identifier = "SPProfileCell"
    let cell = tableView.dequeueReusableCell(withIdentifier: identifier, for: indexPath) as! SPProfileCell
    
    let sp = spNameArray[indexPath.row]
    
    cell.spProfileDisplayName.text = "Welcome \(sp.firstName)"
    
    return cell
  }

}
