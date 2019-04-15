//
//  RenterTeamDisplayController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class RenterTeamDisplayController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
  
  var renterTeamReference: CollectionReference!
  var renterTeamArray = [RenterTeam]()

  @IBOutlet weak var manageMyAccount: UIView!
  @IBOutlet weak var renterTeamView: UICollectionView!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    loadTeamData()
  }
  
  override func viewDidLoad() {
        super.viewDidLoad()
      renterTeamReference = Firestore.firestore().collection("User").document("Renter").collection("MyTeam")
    }
  
  func loadTeamData() {
    renterTeamReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let teamData = snapshot.documents.compactMap({RenterTeam(dictionary: $0.data())})
        self.renterTeamArray = teamData
        DispatchQueue.main.async {
          self.renterTeamView.reloadData()
        }
      }
    }
  }
    
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return renterTeamArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "RenterTeamCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath) as! RenterTeamCell
    
    let renterTeam = renterTeamArray[indexPath.item]
    let fullTitle = "\(renterTeam.firstName) \(renterTeam.lastName), \(renterTeam.assignRole)"
    
    cell.renterTeamName.titleLabel?.text = fullTitle
    
    return cell
  }
    
  @IBAction func dismissAccountManageView(_ sender: Any) {
    manageMyAccount.isHidden = true
  }
  @IBAction func showManageMyAccountView(_ sender: Any) {
    manageMyAccount.isHidden = false
  }
  
  
  @IBAction func dismissManageMyAccount(_ sender: Any) {
   manageMyAccount.isHidden = true
  }
  
    

}
