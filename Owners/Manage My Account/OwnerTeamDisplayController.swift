//
//  OwnerTeamDisplayController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class OwnerTeamDisplayController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
  
  var ownerTeamReference: CollectionReference!
  var ownerTeamArray = [OwnerTeam]()

  @IBOutlet weak var ownerTeamVIew: UICollectionView!
  @IBOutlet weak var ownerManageMyAccount: UIButton!
  @IBOutlet weak var ownerManageMyAccountView: UIView!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    loadOwnerTeamData()
    
  }
  
    override func viewDidLoad() {
        super.viewDidLoad()
      ownerTeamReference = Firestore.firestore().collection("User").document("Owner").collection("MyTeam")
    }
  
  func loadOwnerTeamData() {
    ownerTeamReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let ownerTeamData = snapshot.documents.compactMap({OwnerTeam(dictionary: $0.data())})
        self.ownerTeamArray = ownerTeamData
        DispatchQueue.main.async {
          self.ownerTeamVIew.reloadData()
        }
      }
    }
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return ownerTeamArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "OwnerTeamViewCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath) as! OwnerTeamViewCell
    
    let ownerTeam = ownerTeamArray[indexPath.item]
    let fullTitle = "\(ownerTeam.firstName) \(ownerTeam.lastName), \(ownerTeam.assignRole)"
    
    cell.ownerTeamNameAndTitle.titleLabel?.text = fullTitle
    
    return cell
  }
    
  @IBAction func showManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = false
  }
  @IBAction func dismissManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  @IBAction func closeManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
  

    
}
