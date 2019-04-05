<?php
include_once './Common.php';
include_once './dbDiff.php';

include_once './public/head.html';
include_once './public/menu.html';

$dbs = SqlQuery("select * from bt_default.bt_databases where name !='bt_default'");
$response = array();
$dbs_config = array();
foreach ($dbs as $key => $db_config) {
    $name = $db_config['name'];
    $user = $db_config['username'];
    $password = $db_config['password'];
    $dbs_config[] = array('name' => $name, 'config' => array('host' => 'localhost', 'user' => $user, 'password' => $password, 'name' => $name));
}

function echo_error($error){
    echo '<p class="error">', $error, '</p>';
}

function strip_nl($str){
    return str_replace(array("\n", "\r"), '', $str);
}

function s($count){
    return $count != 1 ? 's' : '';
}

function do_compare($schema1, $schema2){
    if (empty($schema1) || empty($schema2)) {
        echo_error('Both schemas must be given.');
        return;
    }

    $unserialized_schema1 = unserialize(strip_nl($schema1));
    $unserialized_schema2 = unserialize(strip_nl($schema2));

    $results = DbDiff::compare($unserialized_schema1, $unserialized_schema2);

    if (count($results) > 0) {

        echo '<div class="important-title"><span class="glyphicon glyphicon-alert" style="color: #f39c12; margin-right: 10px;"></span>Found differences in ' . count($results) . ' table' . s(count($results)) . ':</div>';

        echo '<ul id="differences">';
        foreach ($results as $table_name => $differences) {

            echo '<li><strong>' . $table_name . '</strong><ul>';
            foreach ($differences as $difference) {
                echo '<li>' . $difference . '</li>';
            }
            echo '</ul></li>';
        }
        echo '</ul>';
    } else {
        echo '<p>No differences found.</p>';
    }
}

function show_options($dbs_config){
    echo '<form action="?a=compare" method="post" id="compare">';
        echo '<p><span class="set-tit">First schema</span><select name="schema1">';
        foreach ($dbs_config as $key => $db_config) {
            echo '<option value=' . $key . '>' . $db_config['name'] . '</option>';
        }
        echo '</select></p>';
        echo '<p><span class="set-tit">Second schema</span><select name="schema2">';
        foreach ($dbs_config as $key => $db_config) {
            echo '<option value=' . $key . '>' . $db_config['name'] . '</option>';
        }
        echo '</select></p>';

    echo '<div style="margin: 20px 0 10px 100px;"><input type="submit" class="btn btn-info btn-sm btn-title" value="Compare" /></div>';
    echo '</form>';
}

?>

										<div class="main-content">
                        <div class="container-fluid">
                            <div class="pos-ser">
                                <div class="position">
                                    <a href="/index.php">Home</a>/<span>Database Compare</span>
                                </div>
                            </div>

        										<div class="setbox">
				<div class="s-title">
					<h3>Comparing database schemas</h3>
				</div>
                                                  <?php //echo '<pre>'; print_r($response); echo '</pre>'; echo json_encode($response, JSON_PRETTY_PRINT);?>
				<div class="setting-con">

            										<?php
            										$action = @$_GET['a'];
            										switch ($action) {
                										case 'compare':

                    										$schema1 = $dbs_config[@$_POST['schema1']];
                    										$schema2 = $dbs_config[@$_POST['schema2']];

                    										$schema1 = serialize(DbDiff::export($schema1['config'], $schema1['name']));
                    										$schema2 = serialize(DbDiff::export($schema2['config'], $schema2['name']));

                    										do_compare($schema1, $schema2);

                    								break;
                										default:
                    										show_options($dbs_config);
            										}
            										?>
        										</div>
                                                  </div>

                      	</div>
										</div>

<?php
//include_once './public/compare.html';
include_once './public/footer.html';
?>
