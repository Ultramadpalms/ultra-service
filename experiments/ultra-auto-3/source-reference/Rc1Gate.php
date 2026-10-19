<?php
defined('_JEXEC') or die;

/** Release 1 route gate. No URL or query parameter can enable a release. */
final class UsaRc1Gate
{
    private static ?array $result = null;
    public static function context(): array
    {
        if (self::$result !== null) return self::$result;
        self::$result = [];
        // Read data, not cached PHP bytecode: emergency OFF is effective on the next request.
        $raw=@file_get_contents(JPATH_THEMES.'/ultraserviceauto/rc1/control.php');
        if (!$raw || !preg_match('/RC1_CONTROL\R(.*?)\RRC1_CONTROL/s',$raw,$match)) return [];
        $cfg=json_decode($match[1],true);
        if (!is_array($cfg)) return [];
        if (($cfg['enabled'] ?? false) !== true) return [];
        $app = \Joomla\CMS\Factory::getApplication();
        if ($app->input->getCmd('option') !== 'com_content') return [];
        if (isset($_GET['layout']) || (isset($_GET['format']) && $_GET['format']!=='html')) return [];
        $id=$app->input->getInt('id'); $view=$app->input->getCmd('view');
        $map = [
            'article:3'=>['home','/','home',null,null,null,3],
            'category:35'=>['model:35','/brands/zeekr/001','model','zeekr','001',null,35],
            'category:36'=>['model:36','/brands/zeekr/007','model','zeekr','007',null,36],
            'category:37'=>['model:37','/brands/zeekr/009','model','zeekr','009',null,37],
            'category:40'=>['model:40','/brands/zeekr/9x','model','zeekr','9x',null,40],
            'category:64'=>['model:64','/brands/voyah/free','model','voyah','free',null,64],
            'category:89'=>['model:89','/brands/changan/uni-k-idd','model','changan','uni-k-idd',null,89],
            'article:202'=>['service:202','/brands/zeekr/001/remont-i-obsluzhivanie-vvb-na-zeekr-001','service','zeekr','001','HV_BATTERY_REPAIR_SERVICE',202],
        ];
        $row=$map[$view.':'.$id] ?? null;
        $modelOnly=false; $waveEnabled=false;
        if (!$row && $view==='category') {
            $waveRaw=@file_get_contents(JPATH_THEMES.'/ultraserviceauto/rc1/stage5-waves.php');
            if ($waveRaw && preg_match('/STAGE5_WAVES\R(.*?)\RSTAGE5_WAVES/s',$waveRaw,$waveMatch)) {
                $waves=json_decode($waveMatch[1],true);
                foreach (($waves['waves'] ?? []) as $wave) {
                    $entry=$wave['models'][(string)$id] ?? null;
                    if (($wave['enabled'] ?? false)!==true || !is_array($entry)) continue;
                    if (!is_string($entry['path'] ?? null) || !str_starts_with($entry['path'],'/brands/')) continue;
                    $row=['model:'.$id,$entry['path'],'model',$entry['brand'],$entry['model'],null,$id];
                    $modelOnly=true; $waveEnabled=true; break;
                }
            }
        }
        if (!$row || (!$waveEnabled && ($cfg['routes'][$row[0]] ?? false)!==true)) return [];
        $path=rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '',PHP_URL_PATH) ?? '', '/') ?: '/';
        if ($path!==$row[1]) return [];
        if ($row[2] !== 'home') {
            try {
                $db=\Joomla\CMS\Factory::getContainer()->get(\Joomla\Database\DatabaseInterface::class);
                $category=$view==='category' ? $id : 35;
                $context=$view==='category' ? 'model' : 'service';
                $db->setQuery('SELECT p.feature_enabled FROM #__usa_presentation p JOIN #__usa_scope s ON s.id=p.scope_id WHERE s.model_category_id='.(int)$category.' AND p.context_key='.$db->quote($context));
                if ((int)$db->loadResult()!==1) return [];
                if ($modelOnly) { $db->setQuery('SELECT COUNT(*) FROM #__categories WHERE id='.(int)$id.' AND published=1 AND path='.$db->quote(ltrim($row[1],'/'))); if ((int)$db->loadResult()!==1) return []; }
            } catch (\Throwable $e) {
                // Missing schema or unavailable DB: old renderer remains available.
                error_log('USA_RC1 gate_unavailable'); return [];
            }
        }
        $result=['page_type'=>$row[2],'brand'=>$row[3],'model'=>$row[4],'service'=>$row[5],'symptom'=>null,'route_key'=>$row[0]];
        if ($modelOnly) $result['model_only']=true;
        return self::$result=$result;
    }
    public static function active(): bool { return self::context()!==[]; }
}
