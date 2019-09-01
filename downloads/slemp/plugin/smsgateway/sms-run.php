<?php

echo "SMS server running....";

include ('sms-config.php');

// mencatat tanggal sekarang
$now = date("Y-m-d");


// ---------------------- PROSEDUR AUTO RECEIVED TO INBOX START ------------------------------

$query = "SELECT * FROM inbox
          WHERE textdecoded NOT LIKE 'REG%' AND textdecoded NOT LIKE 'INFO#%' AND (UDH = '' OR UDH LIKE '%01') AND processed = 'false'";

$hasil = mysqli_query($conn,$query);
while ($data = mysqli_fetch_array($hasil))
{
   $sum = 0;
   $noTelp = $data['SenderNumber'];
   $id_gateway = $data['RecipientID'];

   if ($data['UDH'] != '')
   {

      $chop = substr($data['UDH'], 0, 8);
	  $n = (int) substr($data['UDH'], 8, 2);
	  $text = "";
	  for ($i=1; $i<=$n; $i++)
	  {
	     $udh = $chop.sprintf("%02s", $n).sprintf("%02s", $i);
		 $query3 = "SELECT * FROM inbox WHERE udh = '$udh' AND SenderNumber = '$noTelp' AND processed = 'false'";
		 $hasil3 = mysqli_query($conn,$query3);
		 if (mysqli_num_rows($hasil3) > 0) $sum++;
	  }

	  if ($sum == $n)
	  {
	  	  for ($i=1; $i<=$n; $i++)
	      {
	         $udh = $chop.sprintf("%02s", $n).sprintf("%02s", $i);
		     $query3 = "SELECT * FROM inbox WHERE udh = '$udh' AND SenderNumber = '$noTelp' AND processed = 'false'";
		     $hasil3 = mysqli_query($conn,$query3);
		     $data3 = mysqli_fetch_array($hasil3);
			 $text .= $data3['TextDecoded'];
			 $id = $data3['ID'];
			 $query3 = "UPDATE inbox SET processed = 'true' WHERE ID = '$id'";
			 mysqli_query($conn,$query3);
	      }

		  $notelp = $data['SenderNumber'];
		  $time = $data['ReceivingDateTime'];
		  $text = str_replace("'", "", $text);
		  $query2 = "INSERT INTO sms(id_pesan, sms_masuk, no_hp, pdu_pesan, encoding, id_gateway, tgl_sms, stts_baca, stts_balas) VALUES (NULL, '$text', '$notelp', '-', '-', '$id_gateway', '$time', '0', '0')";
		  mysqli_query($conn,$query2);
	  }

   }
   else
   {
      $id = $data['ID'];
      $text = str_replace("'", "", $data['TextDecoded']);
      $query2 = "UPDATE inbox SET processed = 'true' WHERE ID = '$id'";
      mysqli_query($conn,$query2);
	  $notelp = $data['SenderNumber'];
	  $time = $data['ReceivingDateTime'];
      $query2 = "INSERT INTO sms(id_pesan, sms_masuk, no_hp, pdu_pesan, encoding, id_gateway, tgl_sms, stts_baca, stts_balas) VALUES (NULL, '$text', '$notelp', '-', '-', '$id_gateway', '$time', '0', '0')";
	  mysqli_query($conn,$query2);
   }

}

// ---------------------- PROSEDUR AUTO RECEIVED TO INBOX END ------------------------------


// ---------------------- PROSEDUR AUTO RECEIVED & REPLY SMS START-------------------------

// command SMS: INFO#NO_RM

$query = "SELECT * FROM inbox WHERE textdecoded LIKE 'INFO%' AND Processed = 'false'";
$hasil = mysqli_query($conn,$query);

while ($data = mysqli_fetch_array($hasil)) {
    $idmsg = $data['ID'];
    $notelp = $data['SenderNumber'];
    $split = explode("#", strtoupper($data['TextDecoded']));
    $command = strtoupper($split[0]);

    if (($command == "INFO") && (count($split) == 2)) {

        $no_rkm_medis = $split[1];

        $query1 = "SELECT nm_pasien FROM pasien WHERE no_rkm_medis = '$no_rkm_medis'";
        $hasil1 = mysqli_query($conn,$query1);
        $data1 = mysqli_fetch_assoc($hasil1);
        $nm_pasien = $data1['nm_pasien'];

        $msgReply = "Nomor RM [no_rkm_medis] adalah [nm_pasien]. [ICT RSHD]";

        $msgReply = str_replace('[no_rkm_medis]', $no_rkm_medis, $msgReply);
        $msgReply = str_replace('[nm_pasien]', $nm_pasien, $msgReply);
        $msgReply = str_replace("\r"," ",$msgReply);
        $msgReply = str_replace("\n","",$msgReply);
        $msgReply = str_replace("'","",$msgReply);
        $msgReply = str_replace('"','',$msgReply);
        $reply = $msgReply;

    } else {
        $reply = "Format INFO salah. Format yang benar INFO#NO_RM. [ICT RSHD]";
    }

    $query2 = "INSERT INTO outbox (DestinationNumber, TextDecoded, CreatorID) VALUES ('$notelp', '$reply', 'SMS Gateway')";
    $hasil2 = mysqli_query($conn,$query2);

    $query3 = "UPDATE inbox SET Processed = 'true' WHERE ID = '$idmsg'";
    $hasil3 = mysqli_query($conn,$query3);
}

// ---------------------- PROSEDUR AUTO RECEIVED & REPLY SMS FINISH -------------------------


?>
