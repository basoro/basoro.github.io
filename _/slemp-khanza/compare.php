<?php
include_once './Common.php';
include_once './dbDiff.php';

$dbs_config = array(
	 array(
	 	'name' => 'SIK',
	 	'config' => array(
	 		'host'		=> 'localhost',
	 		'user'		=> 'sik',
	 		'password'	=> 'basoro',
	 		'name'		=> 'sik'
	 	)
	 ),
   array(
	 	'name' => 'SIK Github',
	 	'config' => array(
	 		'host'		=> 'localhost',
	 		'user'		=> 'sikgithub',
	 		'password'	=> 'basoro',
	 		'name'		=> 'sikgithub'
	 	)
	 ),
);

include_once './public/head.html';
include_once './public/menu.html';

function show_options($dbs_config)
{
    echo '<p class="info">Once two database schemas have been exported, paste them here to be compared.</p>';

    echo '<form action="?a=compare" method="post" id="compare">';
    if (count($dbs_config) < 2) {
        echo '<div class="field"><label for="schema1">First schema</label><textarea name="schema1" id="schema1" cols="100" rows="5"></textarea></div>';
        echo '<div class="field"><label for="schema2">Second schema</label><textarea name="schema2" id="schema2" cols="100" rows="5"></textarea></div>';
    } else {
        echo '<div class=""><label for="schema1">First schema</label><select name="schema1">';
        foreach ($dbs_config as $key => $db_config) {
            echo '<option value=' . $key . '>' . $db_config['name'] . '</option>';
        }
        echo '</select></div>';
        echo '<div class=""><label for="schema2">Second schema</label><select name="schema2">';
        foreach ($dbs_config as $key => $db_config) {
            echo '<option value=' . $key . '>' . $db_config['name'] . '</option>';
        }
        echo '</select></div>';
    }

    echo '<div class="submit"><input type="submit" value="Compare" /></div>';
    echo '</form>';
}

function echo_error($error)
{
    echo '<p class="error">', $error, '</p>';
}

function strip_nl($str)
{
    return str_replace(array("\n", "\r"), '', $str);
}

function s($count)
{
    return $count != 1 ? 's' : '';
}

function do_compare($schema1, $schema2)
{
    if (empty($schema1) || empty($schema2)) {
        echo_error('Both schemas must be given.');
        return;
    }

    $unserialized_schema1 = unserialize(strip_nl($schema1));
    $unserialized_schema2 = unserialize(strip_nl($schema2));

    $results = DbDiff::compare($unserialized_schema1, $unserialized_schema2);

    if (count($results) > 0) {

        echo '<h3>Found differences in ' . count($results) . ' table' . s(count($results)) . ':</h3>';

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
?>

<div class="main-content">
                        <div class="container-fluid">
                                <div class="pos-ser">
                                        <div class="position">
                                                <a href="/index.php">Home</a>/<span>Database Compare</span>
                                        </div>
                                </div>
                        </div>

        <div id="canvas">
            <h1><a href="?">DbDiff</a></h1>
            <h2>Tool for comparing database schemas.</h2>

            <?php
            $action = @$_GET['a'];

            switch ($action) {

                case 'compare':
                    if (count($dbs_config) < 2) {
                        $schema1 = @$_POST['schema1'];
                        $schema2 = @$_POST['schema2'];

                        if (get_magic_quotes_gpc()) { // sigh...
                            $schema1 = stripslashes($schema1);
                            $schema2 = stripslashes($schema2);
                        }
                    } else {
                        $schema1 = $dbs_config[@$_POST['schema1']];
                        $schema2 = $dbs_config[@$_POST['schema2']];

                        $schema1 = serialize(DbDiff::export($schema1['config'], $schema1['name']));
                        $schema2 = serialize(DbDiff::export($schema2['config'], $schema2['name']));
                    }

                    do_compare($schema1, $schema2);

                    echo '<p><a href="?">&laquo; Back to main page</a></p>';
                    break;
                default:
                    show_options($dbs_config);
            }
            ?>
        </div>

</div>

<?php
//include_once './public/compare.html';
include_once './public/footer.html';
?>
