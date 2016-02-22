<?php

	class Widget {
		private $css, $js, $html, $content;

		function __construct() {
			$this->css = array();
			$this->js = array();
			$this->content = array();

			$this->html = file_get_contents($_GET['page']);
			$this->isContainerClassOpen = false;

			$this->parseSubWidget();

			if ($this->isContainerClassOpen) {
				$this->html .= "</div>";
			}

			$info = pathinfo($_GET['page']);

			$this->loadDependencies($info['dirname'], $info['filename'] ? $info['filename'] : 'index');
		}

		function parseSubWidget() {
			$hasVars = false;

			if (preg_match_all("/\[\[widget:(.+)\]\]/", $this->html, $m)) {
				$hasVars = true;

				foreach ($m[1] as $indx => $widgetName) {
					$arr = explode('/', $widgetName);
					$filename = 'index';

					if (count($arr) == 2) {
						$filename = $arr[1];
					}

					$widgetName = $arr[0];

					$files = array(
						'../widgets/' . $widgetName . '.htm',
						'../widgets/' . $widgetName . '.html',
						'../widgets/' . $widgetName . '/' . $filename . '.htm',
						'../widgets/' . $widgetName . '/' . $filename . '.html'
					);

					foreach ($files as $file) {
						if (file_exists($file)) {
							$widgetContent = file_get_contents($file);
							$content = '';

							if (isset($_GET['ReduceContainer']) && false) {
								$dom = new DOMDocument();
								$dom->loadHTML($widgetContent);

								$xPath = new DOMXPath($dom);
								$queries = array(
									"/html/body/*[@class='container']", //Root node only contains "container" class
									"/html/body/*[contains(@class, 'container')]", //Root node contains "container" class
									"/html/body/*"
								);

								$rootResult = $xPath->query("/html/body/*"); //Find all root elements.

								for ($counter = 0; $counter < $rootResult->length; $counter++) {
									$dom2 = new DOMDocument();
									$dom2->loadHTML($dom->saveHTML($rootResult->item($counter)));
									$xPath2 = new DOMXPath($dom2);

									foreach ($queries as $indx2 => $q) {
										$result = $xPath2->query($q);

										if ($result->length) {
											if ($indx2 == 0) {
												if (!$this->isContainerClassOpen) {
													$content .= '<div class="container" data-dynamically-added="true">';
													$this->isContainerClassOpen = true;
												}

												for ($c = 0; $c < $result->item(0)->childNodes->length; $c++) {
													$content .= $dom2->saveHTML($result->item(0)->childNodes->item($c));
													//$content .= $dom->saveHTML($xPath->query("/html/body/*", $result->item(0)->childNodes->item($c)));
												}
											}
											else if ($indx2 == 1) {
												if ($this->isContainerClassOpen) {
													$content .= "</div>";
													$this->isContainerClassOpen = false;
												}

												$content .= $dom2->saveHTML($result->item(0));
												//$content .= $dom->saveHTML($xPath->query("/html/body/*", $result->item(0)));
											}
											else {
												if ($this->isContainerClassOpen) {
													$content .= "</div>";
													$this->isContainerClassOpen = false;
												}

												$content .= $dom2->saveHTML($result->item(0));
												//$content .= $dom->saveHTML($xPath->query("/html/body/*", $result->item(0)));
											}

											break;
										}
									}
								}
							}
							else {
								$content = $widgetContent;
							}

							$this->html = str_replace($m[0][$indx], $content, $this->html);

							break;
						}
					}

					$this->html = str_replace($m[0][$indx], '', $this->html);

					$this->loadDependencies($widgetName, $filename);
				}
			}

			/*if(preg_match_all("/\[\[content:(.+)\]\](.+?)\[\[\/content\]\]/", $this->html, $m)) {
					$hasVars = true;
					print_r($m);
			}*/

			if ($hasVars) {
				$this->parseSubWidget();
			}
		}

		function loadDependencies($widgetName, $filename) {
			if (file_exists('../pages/' . $widgetName . '/config.json')) {
				$tmpJSON = json_decode(file_get_contents('../pages/' . $widgetName . '/config.json'), true);

				if (isset($tmpJSON['css'])) {
					$this->css = array_merge($tmpJSON['css'], $this->css);
				}

				if (isset($tmpJSON['js'])) {
					$this->js = array_merge($tmpJSON['js'], $this->js);
				}
			}

			if (file_exists('../pages/' . $widgetName . '/' . $filename . '.css')) {
				$this->css[] = '../../pages/' . $widgetName . '/' . $filename . '.css';
			}

			if (file_exists('../pages/' . $widgetName . '/' . $filename . '.js')) {
				$this->js[] = '../../pages/' . $widgetName . '/' . $filename . '.js';
			}
		}

		function css() {
			$html = array();

			foreach ($this->css as $href) {
				$html[] = '<link rel="stylesheet" href="' . $href . '">';
			}

			return implode("\n", $html);
		}

		function js() {
			$html = array();

			foreach ($this->js as $src) {
				$html[] = '<script src="' . $src . '"></script>';
			}

			return implode("\n", $html);
		}

		function localizedContent() {
			$obj = array(
				'type' => 'localized tags',
				'tags' => ''
			);

			if (preg_match_all("/{{(.+)}}/", $this->html, $m)) {
				$obj['tags'] = implode(',', $m[1]);

				//open connection
				$ch = curl_init();

				//set the url, number of POST vars, POST data
				curl_setopt($ch, CURLOPT_URL, 'http://stage.software.dell.com/jsonreq/event/');
				curl_setopt($ch, CURLOPT_POST, count($obj));
				curl_setopt($ch, CURLOPT_POSTFIELDS, $obj);

				//execute post
				ob_start();
				curl_exec($ch);
				$result = json_decode(ob_get_clean());

				//close connection
				curl_close($ch);

				foreach ($result->data as $indx => $data) {
					$this->html = str_replace('{{' . $data->id . '}}', $data->value, $this->html);
				}
			}
		}

		function content() {
			$this->localizedContent();

			return $this->html;
		}
	}